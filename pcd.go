package main

import (
	"encoding/csv"
	"fmt"
	"io"
	"math"
	"net/http"
	"strings"
	"sync"
	"time"
	"unicode/utf8"
)

// Stable bisection also handles zero interest, where Newton's formula divides by zero.
func loanRate(n int, payment, principal float64) (float64, error) {
	if n <= 0 || payment <= 0 || principal <= 0 || principal > payment*float64(n) {
		return 0, fmt.Errorf("invalid loan")
	}
	if principal == payment*float64(n) {
		return 0, nil
	}
	pv := func(rate float64) float64 { return payment * (-math.Expm1(-float64(n) * math.Log1p(rate))) / rate }
	if pv(.15) > principal {
		return 0, fmt.Errorf("implausible rate")
	}
	lo, hi := 0., .15
	for i := 0; i < 100; i++ {
		mid := (lo + hi) / 2
		if pv(mid) > principal {
			lo = mid
		} else {
			hi = mid
		}
	}
	return (lo + hi) / 2, nil
}
func months(start, end time.Time) int {
	months := (end.Year()-start.Year())*12 + int(end.Month()-start.Month())
	if end.Day() < start.Day() {
		months--
	}
	return months + 1
}
func calculateLoan(m object) string {
	p, e := time.Parse("2006-01-02", text(m, "proximaParcela"))
	if e != nil {
		return "error.validacao"
	}
	u, e := time.Parse("2006-01-02", text(m, "ultimaParcela"))
	if e != nil {
		return "error.validacao"
	}
	n := num(m, "quantidadeParcelas")
	payment, principal := num(m, "valorParcela")/100, num(m, "valorEmprestado")/100
	if strings.TrimSpace(text(m, "codigoBanco")) == "" || n <= 0 || n != math.Trunc(n) || n > 2147483647 || payment <= 0 || principal <= 0 {
		return "error.validacao"
	}
	if u.Before(p) {
		return "pcd.erro.datas"
	}
	if principal > payment*n {
		return "pcd.erro.valorEmprestadoMaiorQueTotal"
	}
	remaining := months(p, u)
	if remaining > int(n) {
		return "pcd.erro.mesesEmSerMaiorQueParcelas"
	}
	rate, e := loanRate(int(n), payment, principal)
	if e != nil {
		return "pcd.erro.taxaImplausivel"
	}
	balance := payment * float64(remaining)
	if rate != 0 {
		balance = payment * (-math.Expm1(-float64(remaining) * math.Log1p(rate))) / rate
	}
	m["valorParcela"] = payment
	m["valorEmprestado"] = principal
	m["taxaJuros"] = rate
	m["mesesEmSer"] = remaining
	m["saldoDevedor"] = -balance
	return ""
}
func loanResponse(m object) object {
	m["taxaJuros"] = num(m, "taxaJuros") * 100
	m["saldoDevedor"] = -num(m, "saldoDevedor")
	return m
}
func (a *app) loanCreate(w http.ResponseWriter, r *http.Request) any {
	m := body(r)
	if key := calculateLoan(m); key != "" {
		bad(a.message(r, key))
	}
	id := uuid()
	a.insert("tb_calculo_emprestimo", object{"id": a.id("tb_calculo_emprestimo", "id", id), "codigo_banco": m["codigoBanco"], "proxima_parcela": m["proximaParcela"], "ultima_parcela": m["ultimaParcela"], "quantidade_parcelas": m["quantidadeParcelas"], "valor_parcela": m["valorParcela"], "valor_emprestado": m["valorEmprestado"], "taxa_juros": m["taxaJuros"], "meses_em_ser": m["mesesEmSer"], "saldo_devedor": m["saldoDevedor"], "created_at": now()})
	return loanResponse(one(a.query("SELECT * FROM tb_calculo_emprestimo WHERE id=?", a.id("tb_calculo_emprestimo", "id", id))))
}
func (a *app) loans(w http.ResponseWriter, r *http.Request) any {
	z, _ := time.LoadLocation("America/Sao_Paulo")
	t := now().In(z)
	start := time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, z).In(time.Local)
	rows := a.query("SELECT * FROM tb_calculo_emprestimo WHERE created_at BETWEEN ? AND ? ORDER BY created_at DESC", start, start.AddDate(0, 0, 1))
	for _, m := range rows {
		loanResponse(m)
	}
	return rows
}

var bankLock sync.Mutex

func decodeCSV(b []byte) string {
	if utf8.Valid(b) {
		return strings.TrimPrefix(string(b), "\ufeff")
	}
	r := make([]rune, len(b))
	for i, v := range b {
		r[i] = rune(v)
	}
	return string(r)
}
func parseBanks(b []byte) ([][]string, error) {
	s := decodeCSV(b)
	reader := csv.NewReader(strings.NewReader(s))
	if first, _, _ := strings.Cut(s, "\n"); strings.Count(first, ";") > strings.Count(first, ",") {
		reader.Comma = ';'
	}
	reader.FieldsPerRecord = -1
	reader.LazyQuotes = true
	if _, e := reader.Read(); e != nil {
		return nil, e
	}
	out := [][]string{}
	for {
		row, e := reader.Read()
		if e == io.EOF {
			break
		}
		if e != nil {
			return nil, e
		}
		if len(row) != 7 {
			continue
		}
		for i := range row {
			row[i] = strings.TrimSpace(row[i])
		}
		code := row[2]
		if len(code) != 3 || code[0] < '0' || code[0] > '9' || code[1] < '0' || code[1] > '9' || code[2] < '0' || code[2] > '9' {
			continue
		}
		out = append(out, row)
	}
	if len(out) == 0 {
		return nil, fmt.Errorf("CSV de bancos não contém registros válidos")
	}
	return out, nil
}
func (a *app) refreshBanks(r *http.Request) {
	bankLock.Lock()
	defer bankLock.Unlock()
	var latest time.Time
	e := a.db.QueryRow("SELECT created_at FROM tb_banco ORDER BY created_at DESC LIMIT 1").Scan(&latest)
	if e == nil && latest.Format("2006-01-02") == now().Format("2006-01-02") {
		return
	}
	req, e := http.NewRequestWithContext(r.Context(), "GET", env("BANK_CSV_URL", "https://www.bcb.gov.br/content/estabilidadefinanceira/str1/ParticipantesSTR.csv"), nil)
	check(e)
	client := http.Client{Timeout: 30 * time.Second}
	resp, e := client.Do(req)
	check(e)
	defer resp.Body.Close()
	if resp.StatusCode != 200 {
		panic(fmt.Errorf("download BCB: HTTP %d", resp.StatusCode))
	}
	b, e := io.ReadAll(io.LimitReader(resp.Body, 10<<20))
	check(e)
	rows, e := parseBanks(b)
	check(e)
	tx, e := a.db.BeginTx(r.Context(), nil)
	check(e)
	defer tx.Rollback()
	_, e = tx.Exec("DELETE FROM tb_banco")
	check(e)
	for _, v := range rows {
		_, e = tx.Exec("INSERT INTO tb_banco(id,ispb,nome_reduzido,numero_codigo,participa_compe,acesso_principal,nome_extenso,inicio_operacao,created_at) VALUES(?,?,?,?,?,?,?,?,?)", a.id("tb_banco", "id", uuid()), v[0], v[1], v[2], v[3], v[4], v[5], v[6], now())
		check(e)
	}
	check(tx.Commit())
}
func (a *app) bank(w http.ResponseWriter, r *http.Request) any {
	a.refreshBanks(r)
	code := r.PathValue("code")
	if len(code) < 3 {
		code = strings.Repeat("0", 3-len(code)) + code
	}
	rows := a.query("SELECT * FROM tb_banco WHERE numero_codigo=?", code)
	if len(rows) == 0 {
		panic(failure{404, a.message(r, "pcd.erro.banco.naoEncontrado")})
	}
	return rows[0]
}
