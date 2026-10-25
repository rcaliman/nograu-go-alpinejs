package main

import (
	"context"
	"crypto/rand"
	"database/sql"
	"embed"
	"encoding/hex"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io"
	"io/fs"
	"log"
	"net/http"
	"os"
	"os/signal"
	"sort"
	"strconv"
	"strings"
	"syscall"
	"time"
	_ "time/tzdata"
)

//go:embed web/static
var assets embed.FS

//go:embed web/i18n/messages*.properties
var translations embed.FS

type object = map[string]any
type app struct {
	db      *sql.DB
	columns map[string]map[string]string
	cfg     config
}
type failure struct {
	status  int
	message string
}

func (e failure) Error() string { return e.message }
func bad(s string)              { panic(failure{400, s}) }
func check(e error) {
	if e != nil {
		panic(e)
	}
}
func env(k, d string) string {
	if v, ok := os.LookupEnv(k); ok {
		return v
	}
	return d
}
func uuid() string {
	b := make([]byte, 16)
	_, e := rand.Read(b)
	check(e)
	b[6] = (b[6] & 15) | 64
	b[8] = (b[8] & 63) | 128
	return fmt.Sprintf("%x-%x-%x-%x-%x", b[:4], b[4:6], b[6:8], b[8:10], b[10:])
}
func validUUID(s string) bool {
	b, e := hex.DecodeString(strings.ReplaceAll(s, "-", ""))
	return e == nil && len(b) == 16 && len(s) == 36 && s[8] == '-' && s[13] == '-' && s[18] == '-' && s[23] == '-'
}
func (a *app) id(table, col, s string) any {
	if !validUUID(s) {
		bad("UUID inválido")
	}
	if strings.Contains(a.columns[table][col], "binary") {
		b, _ := hex.DecodeString(strings.ReplaceAll(s, "-", ""))
		return b
	}
	return s
}
func camel(s string) string {
	p := strings.Split(s, "_")
	for i := 1; i < len(p); i++ {
		p[i] = strings.ToUpper(p[i][:1]) + p[i][1:]
	}
	return strings.Join(p, "")
}
func (a *app) query(q string, args ...any) []object {
	rows, e := a.db.Query(q, args...)
	check(e)
	defer rows.Close()
	cols, e := rows.Columns()
	check(e)
	types, e := rows.ColumnTypes()
	check(e)
	out := []object{}
	for rows.Next() {
		v := make([]any, len(cols))
		ptr := make([]any, len(cols))
		for i := range v {
			ptr[i] = &v[i]
		}
		check(rows.Scan(ptr...))
		m := object{}
		for i, c := range cols {
			x := v[i]
			if b, ok := x.([]byte); ok {
				if strings.Contains(types[i].DatabaseTypeName(), "BINARY") && len(b) == 16 && (c == "id" || strings.HasSuffix(c, "_id") || c == "id_resposta") {
					x = fmt.Sprintf("%x-%x-%x-%x-%x", b[:4], b[4:6], b[6:8], b[8:10], b[10:])
				} else {
					x = string(b)
					switch types[i].DatabaseTypeName() {
					case "DOUBLE", "FLOAT", "DECIMAL", "NEWDECIMAL":
						x, e = strconv.ParseFloat(string(b), 64)
						check(e)
					}
				}
			}
			if t, ok := x.(time.Time); ok {
				if types[i].DatabaseTypeName() == "DATE" {
					x = t.Format("2006-01-02")
				} else {
					x = localDateTime(t)
				}
			}
			m[camel(c)] = x
		}
		out = append(out, m)
	}
	check(rows.Err())
	return out
}
func localDateTime(t time.Time) string {
	s := t.Format("2006-01-02T15:04")
	if t.Second() != 0 || t.Nanosecond() != 0 {
		s = t.Format("2006-01-02T15:04:05")
	}
	if n := t.Nanosecond(); n != 0 {
		digits := 3
		if n%1000000 != 0 {
			digits = 6
		}
		if n%1000 != 0 {
			digits = 9
		}
		s += "." + fmt.Sprintf("%09d", n)[:digits]
	}
	return s
}
func one(rows []object) object {
	if len(rows) == 0 {
		panic(failure{404, "Recurso não encontrado"})
	}
	return rows[0]
}
func body(r *http.Request) object {
	defer r.Body.Close()
	var v object
	d := json.NewDecoder(io.LimitReader(r.Body, 1<<20))
	if d.Decode(&v) != nil || v == nil {
		bad("JSON inválido")
	}
	var extra any
	if d.Decode(&extra) != io.EOF {
		bad("JSON inválido")
	}
	return v
}
func text(m object, k string) string { s, _ := m[k].(string); return s }
func num(m object, k string) float64 {
	switch v := m[k].(type) {
	case float64:
		return v
	case int64:
		return float64(v)
	case uint64:
		return float64(v)
	}
	return 0
}
func now() time.Time                      { return time.Now().Truncate(time.Microsecond) }
func (a *app) exec(q string, args ...any) { _, e := a.db.Exec(q, args...); check(e) }
func (a *app) insert(table string, m object) {
	cols := []string{}
	vals := []any{}
	marks := []string{}
	keys := make([]string, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	for _, k := range keys {
		cols = append(cols, "`"+k+"`")
		vals = append(vals, m[k])
		marks = append(marks, "?")
	}
	a.exec("INSERT INTO `"+table+"` ("+strings.Join(cols, ",")+") VALUES ("+strings.Join(marks, ",")+")", vals...)
}
func (a *app) message(r *http.Request, key string) string {
	file := "web/i18n/messages.properties"
	if strings.HasPrefix(strings.ToLower(r.Header.Get("Accept-Language")), "en") {
		file = "web/i18n/messages_en.properties"
	}
	b, _ := translations.ReadFile(file)
	for _, line := range strings.Split(string(b), "\n") {
		if strings.HasPrefix(line, key+"=") {
			return strings.TrimPrefix(line, key+"=")
		}
	}
	return key
}
func (a *app) wrap(fn func(http.ResponseWriter, *http.Request) any) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if e := recover(); e != nil {
				status := 500
				msg := a.message(r, "error.interno")
				switch v := e.(type) {
				case failure:
					status = v.status
					msg = v.message
				default:
					log.Printf("%s %s: %v", r.Method, r.URL.Path, e)
				}
				w.Header().Set("Content-Type", "application/json; charset=utf-8")
				w.WriteHeader(status)
				json.NewEncoder(w).Encode(object{"message": msg})
			}
		}()
		v := fn(w, r)
		if v != nil {
			w.Header().Set("Content-Type", "application/json; charset=utf-8")
			json.NewEncoder(w).Encode(v)
		}
	}
}
func (a *app) count(table string, brasil bool) any {
	t := now()
	if brasil {
		z, _ := time.LoadLocation("America/Sao_Paulo")
		t = t.In(z)
	}
	start := time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, t.Location()).In(time.Local)
	return one(a.query("SELECT COUNT(*) AS total FROM "+table+" WHERE created_at BETWEEN ? AND ?", start, start.AddDate(0, 0, 1)))["total"]
}
func (a *app) routes() http.Handler {
	m := http.NewServeMux()
	m.HandleFunc("POST /fit", a.wrap(a.fitCreate))
	m.HandleFunc("GET /fit", a.wrap(func(w http.ResponseWriter, r *http.Request) any {
		if !r.URL.Query().Has("email") {
			bad("email obrigatório")
		}
		return a.query("SELECT * FROM tb_bikefit WHERE email=? ORDER BY created_at DESC", r.URL.Query().Get("email"))
	}))
	m.HandleFunc("GET /fit/qtd", a.wrap(func(w http.ResponseWriter, r *http.Request) any { return a.count("tb_bikefit", false) }))
	m.HandleFunc("GET /fit/{id}", a.wrap(func(w http.ResponseWriter, r *http.Request) any {
		return one(a.query("SELECT * FROM tb_bikefit WHERE id=?", a.id("tb_bikefit", "id", r.PathValue("id"))))
	}))
	m.HandleFunc("GET /mensagem", a.wrap(a.messages))
	m.HandleFunc("POST /mensagem", a.wrap(a.messageCreate))
	m.HandleFunc("GET /mensagem/{id}", a.wrap(func(w http.ResponseWriter, r *http.Request) any {
		return one(normalizeMessages(a.query(a.messageSQL()+" WHERE m.id=?", r.Header.Get("X-Visitante-Id"), a.id("tb_mensagem", "id", r.PathValue("id")))))
	}))
	m.HandleFunc("POST /mensagem/{id}/like", a.wrap(a.like))
	m.HandleFunc("POST /pcd/calculo", a.wrap(a.loanCreate))
	m.HandleFunc("GET /pcd/qtd-calculos", a.wrap(func(w http.ResponseWriter, r *http.Request) any { return a.count("tb_calculo_emprestimo", true) }))
	m.HandleFunc("GET /pcd/calculos-dia", a.wrap(a.loans))
	m.HandleFunc("GET /pcd/banco/{code}", a.wrap(a.bank))
	m.HandleFunc("POST /pets", a.wrap(a.petCreate))
	m.HandleFunc("GET /pets/{id}", a.wrap(func(w http.ResponseWriter, r *http.Request) any { return a.pet(r.PathValue("id")) }))
	m.HandleFunc("GET /pets/pet/{id}", a.wrap(func(w http.ResponseWriter, r *http.Request) any {
		p := a.pet(r.PathValue("id"))
		p["id"] = nil
		for _, c := range p["contacts"].([]object) {
			c["id"] = nil
		}
		return p
	}))
	m.HandleFunc("PUT /pets/{id}", a.wrap(a.petUpdate))
	m.HandleFunc("DELETE /pets/{id}", a.wrap(a.petDelete))
	sub, e := fs.Sub(assets, "web/static")
	check(e)
	files := http.FileServer(http.FS(sub))
	m.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/tagpet", "/tagpet/":
			http.Redirect(w, r, "/tagpet/pet/pet-form.html", 302)
			return
		case "/pcd", "/pcd/":
			r.URL.Path = "/pcd/"
		case "/conversor", "/conversor/":
			r.URL.Path = "/conversor/"
		}
		w.Header().Set("Cache-Control", "public, max-age=3600")
		files.ServeHTTP(w, r)
	})
	return compression(m)
}
func main() {
	port := flag.String("port", "", "Porta HTTP (1 a 65535); tem precedência sobre HTTP_ADDR e server.port")
	flag.Parse()
	if flag.NArg() != 0 {
		log.Fatal("Argumentos inesperados; use -help para ver as opções")
	}
	cfg, e := loadConfig()
	if e != nil {
		log.Fatal(e)
	}
	if *port != "" {
		cfg.addr, e = addressWithPort(cfg.addr, *port)
		if e != nil {
			log.Fatal(e)
		}
	}
	db, e := sql.Open("mysql", cfg.dsn)
	if e != nil {
		log.Fatal(e)
	}
	defer db.Close()
	db.SetMaxOpenConns(8)
	db.SetMaxIdleConns(4)
	db.SetConnMaxLifetime(3 * time.Minute)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if e = db.PingContext(ctx); e != nil {
		log.Fatal(e)
	}
	a := &app{db: db, cfg: cfg}
	a.logMailConfig()
	if e = a.inspectSchema(); e != nil {
		log.Fatal(e)
	}
	server := &http.Server{Addr: cfg.addr, Handler: a.routes(), ReadHeaderTimeout: 5 * time.Second, ReadTimeout: 30 * time.Second, WriteTimeout: 60 * time.Second, IdleTimeout: 60 * time.Second}
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-stop
		ctx, c := context.WithTimeout(context.Background(), 15*time.Second)
		defer c()
		server.Shutdown(ctx)
	}()
	log.Printf("No Grau em %s", cfg.addr)
	if e = server.ListenAndServe(); !errors.Is(e, http.ErrServerClosed) {
		log.Fatal(e)
	}
}
