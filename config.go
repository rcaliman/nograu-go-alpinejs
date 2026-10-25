package main

import (
	"bufio"
	"database/sql"
	"fmt"
	"net"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/go-sql-driver/mysql"
)

type config struct {
	dsn, addr, baseURL, mailHost, mailPort, mailUser, mailPassword, mailFrom string
	mailTLS                                                                  bool
}

// Optional external Spring properties allow reuse of the deployment's configuration.
// Credentials embedded in the old source tree are deliberately not compiled into Go.
func loadConfig() (config, error) {
	p := map[string]string{}
	path := env("NOGRAU_CONFIG", "application.properties")
	f, e := os.Open(path)
	if e == nil {
		defer f.Close()
		s := bufio.NewScanner(f)
		for s.Scan() {
			line := strings.TrimSpace(s.Text())
			if line == "" || strings.HasPrefix(line, "#") || strings.HasPrefix(line, "!") {
				continue
			}
			k, v, ok := strings.Cut(line, "=")
			if ok {
				p[strings.TrimSpace(k)] = strings.TrimSpace(v)
			}
		}
		if e = s.Err(); e != nil {
			return config{}, e
		}
	} else if !os.IsNotExist(e) || os.Getenv("NOGRAU_CONFIG") != "" {
		return config{}, e
	}
	get := func(key, def string) string {
		return env(strings.ToUpper(strings.ReplaceAll(strings.ReplaceAll(key, ".", "_"), "-", "_")), func() string {
			if v, ok := p[key]; ok {
				return v
			}
			return def
		}())
	}
	c := config{addr: ":" + get("server.port", "8080"), baseURL: get("nograu.base-url", "http://localhost:8080"), mailHost: get("spring.mail.host", ""), mailPort: get("spring.mail.port", "587"), mailUser: get("spring.mail.username", ""), mailPassword: get("spring.mail.password", ""), mailFrom: get("nograu.mail.from", ""), mailTLS: get("spring.mail.properties.mail.smtp.starttls.enable", "true") != "false"}
	if c.mailFrom == "" {
		c.mailFrom = c.mailUser
	}
	c.addr = env("HTTP_ADDR", c.addr)
	if dsn := os.Getenv("MYSQL_DSN"); dsn != "" {
		mc, e := mysql.ParseDSN(dsn)
		if e != nil {
			return c, e
		}
		mc.ParseTime = true
		mc.Loc = time.Local
		if mc.Timeout == 0 {
			mc.Timeout = 10 * time.Second
		}
		if mc.ReadTimeout == 0 {
			mc.ReadTimeout = 20 * time.Second
		}
		if mc.WriteTimeout == 0 {
			mc.WriteTimeout = 20 * time.Second
		}
		c.dsn = mc.FormatDSN()
		return c, nil
	}
	raw := get("spring.datasource.url", "jdbc:mysql://localhost:3306/db_nograu")
	u, e := url.Parse(strings.TrimPrefix(raw, "jdbc:"))
	if e != nil {
		return c, e
	}
	if u.Scheme != "mysql" || u.Hostname() == "" {
		return c, fmt.Errorf("spring.datasource.url deve usar jdbc:mysql://host:porta/banco")
	}
	port := u.Port()
	if port == "" {
		port = "3306"
	}
	mc := mysql.NewConfig()
	mc.User = get("spring.datasource.username", "root")
	mc.Passwd = get("spring.datasource.password", "")
	mc.Net = "tcp"
	mc.Addr = net.JoinHostPort(u.Hostname(), port)
	mc.DBName = strings.TrimPrefix(u.Path, "/")
	mc.ParseTime = true
	mc.Loc = time.Local
	mc.Timeout = 10 * time.Second
	mc.ReadTimeout = 20 * time.Second
	mc.WriteTimeout = 20 * time.Second
	mc.Params = map[string]string{"charset": "utf8mb4"}
	q := u.Query()
	if q.Get("useSSL") == "true" {
		mc.TLSConfig = "true"
	}
	c.dsn = mc.FormatDSN()
	return c, nil
}

var requiredSchema = map[string][]string{
	"tb_bikefit":            {"id", "cavalo", "esterno", "braco", "email", "quadro_speed", "quadro_mtb", "altura_selim", "top_tube_efetivo", "created_at"},
	"tb_mensagem":           {"id", "mensagem", "nome", "email", "id_resposta", "created_at"},
	"tb_mensagem_like":      {"id", "mensagem_id", "visitante_id"},
	"tb_banco":              {"id", "ispb", "nome_reduzido", "numero_codigo", "participa_compe", "acesso_principal", "nome_extenso", "inicio_operacao", "created_at"},
	"tb_calculo_emprestimo": {"id", "codigo_banco", "proxima_parcela", "ultima_parcela", "quantidade_parcelas", "valor_parcela", "valor_emprestado", "taxa_juros", "meses_em_ser", "saldo_devedor", "created_at"},
	"pets":                  {"id", "name", "type", "is_community", "more_info", "created_at", "updated_at"},
	"contacts":              {"id", "name", "contact_number", "email", "chat_app", "location", "created_at", "updated_at", "pet_id"},
}

func (a *app) inspectSchema() error {
	rows, e := a.db.Query("SELECT TABLE_NAME,COLUMN_NAME,DATA_TYPE FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE()")
	if e != nil {
		return e
	}
	defer rows.Close()
	a.columns = map[string]map[string]string{}
	for rows.Next() {
		var t, c, d string
		if e = rows.Scan(&t, &c, &d); e != nil {
			return e
		}
		if a.columns[t] == nil {
			a.columns[t] = map[string]string{}
		}
		a.columns[t][c] = d
	}
	if e = rows.Err(); e != nil {
		return e
	}
	for t, cols := range requiredSchema {
		for _, c := range cols {
			if a.columns[t][c] == "" {
				return fmt.Errorf("banco incompatível: falta %s.%s; nenhuma alteração foi feita no schema", t, c)
			}
		}
	}
	for t := range requiredSchema {
		for c, d := range a.columns[t] {
			if c == "id" || c == "pet_id" || c == "mensagem_id" || c == "id_resposta" {
				switch d {
				case "binary", "varbinary", "char", "varchar":
				default:
					return fmt.Errorf("tipo de UUID não suportado: %s.%s (%s)", t, c, d)
				}
			}
		}
	}
	switch a.columns["contacts"]["chat_app"] {
	case "json", "varchar", "text", "longtext", "binary", "varbinary", "blob", "mediumblob", "longblob":
	default:
		return fmt.Errorf("contacts.chat_app usa %s; é necessário verificar a serialização do Hibernate antes da troca", a.columns["contacts"]["chat_app"])
	}
	return nil
}
func scanTime(db *sql.DB, q string, args ...any) time.Time {
	var t time.Time
	check(db.QueryRow(q, args...).Scan(&t))
	return t
}
func pageInt(r string, def int) int {
	if r == "" {
		return def
	}
	n, e := strconv.Atoi(r)
	if e != nil || n < 0 {
		bad("Paginação inválida")
	}
	return n
}

// Keep an explicitly configured bind host when overriding just the port.
func addressWithPort(addr, port string) (string, error) {
	n, err := strconv.Atoi(port)
	if err != nil || n < 1 || n > 65535 {
		return "", fmt.Errorf("porta inválida %q: informe um número de 1 a 65535", port)
	}
	host, _, err := net.SplitHostPort(addr)
	if err != nil {
		return "", fmt.Errorf("endereço HTTP inválido: %w", err)
	}
	return net.JoinHostPort(host, strconv.Itoa(n)), nil
}
