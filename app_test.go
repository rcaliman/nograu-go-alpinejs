package main

import (
	"compress/gzip"
	"database/sql/driver"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"math"
	"net/http/httptest"
	"os"
	"reflect"
	"strings"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
)

const testID = "12345678-1234-4234-8234-123456789abc"

func mockApp(t *testing.T) (*app, sqlmock.Sqlmock) {
	t.Helper()
	db, m, e := sqlmock.New()
	if e != nil {
		t.Fatal(e)
	}
	t.Cleanup(func() {
		if e := m.ExpectationsWereMet(); e != nil {
			t.Error(e)
		}
		db.Close()
	})
	a := &app{db: db, columns: map[string]map[string]string{}}
	for table, cols := range requiredSchema {
		a.columns[table] = map[string]string{}
		for _, c := range cols {
			a.columns[table][c] = "varchar"
		}
		a.columns[table]["id"] = "binary"
	}
	a.columns["tb_mensagem"]["id_resposta"] = "binary"
	a.columns["tb_mensagem_like"]["mensagem_id"] = "binary"
	a.columns["contacts"]["pet_id"] = "binary"
	a.columns["contacts"]["chat_app"] = "json"
	return a, m
}
func request(a *app, method, path, body string, headers ...string) *httptest.ResponseRecorder {
	r := httptest.NewRequest(method, path, strings.NewReader(body))
	for i := 0; i < len(headers); i += 2 {
		r.Header.Set(headers[i], headers[i+1])
	}
	w := httptest.NewRecorder()
	a.routes().ServeHTTP(w, r)
	return w
}
func decode(t *testing.T, w *httptest.ResponseRecorder) object {
	t.Helper()
	var v object
	if e := json.Unmarshal(w.Body.Bytes(), &v); e != nil {
		t.Fatalf("invalid JSON %s: %v", w.Body.String(), e)
	}
	return v
}
func binaryID() []byte { b, _ := hex.DecodeString(strings.ReplaceAll(testID, "-", "")); return b }
func TestEmbeddedPages(t *testing.T) {
	a := &app{}
	for _, path := range []string{"/", "/pcd", "/pcd/", "/conversor", "/conversor/", "/tagpet/pet/pet-form.html", "/app.js", "/img/favicon-16x16.png"} {
		w := request(a, "GET", path, "")
		if w.Code != 200 || w.Body.Len() == 0 {
			t.Errorf("%s: %d %s", path, w.Code, w.Body.String())
		}
	}
	w := request(a, "GET", "/tagpet", "")
	if w.Code != 302 || w.Header().Get("Location") != "/tagpet/pet/pet-form.html" {
		t.Fatal(w)
	}
	if w := request(a, "GET", "/nonexistent", ""); w.Code != 404 {
		t.Fatal(w)
	}
}
func TestValidationBeforeWrites(t *testing.T) {
	a, _ := mockApp(t)
	for _, tc := range []struct{ path, body string }{{"/fit", `{"cavalo":59,"esterno":100,"braco":60,"email":"invalid"}`}, {"/fit", `null`}, {"/fit", `{} {}`}, {"/pets", `{"name":"a","type":"dog","contacts":[null]}`}, {"/pcd/calculo", `{"codigoBanco":"001"}`}} {
		w := request(a, "POST", tc.path, tc.body)
		if w.Code != 400 {
			t.Errorf("%s: %d %s", tc.path, w.Code, w.Body.String())
		}
	}
	w := request(a, "POST", "/fit", `{}`, "Accept-Language", "en")
	if decode(t, w)["message"] != "Invalid data." {
		t.Fatal(w.Body.String())
	}
}
func TestBinaryUUIDAndDates(t *testing.T) {
	a, m := mockApp(t)
	at := time.Date(2026, 10, 25, 12, 30, 0, 123000000, time.Local)
	rows := sqlmock.NewRowsWithColumnDefinition(sqlmock.NewColumn("id").OfType("BINARY", []byte{}), sqlmock.NewColumn("created_at").OfType("DATETIME", time.Time{}), sqlmock.NewColumn("cavalo").OfType("DOUBLE", float64(0))).AddRow(binaryID(), at, 80.)
	m.ExpectQuery("SELECT \\* FROM tb_bikefit WHERE id=\\?").WithArgs(binaryID()).WillReturnRows(rows)
	w := request(a, "GET", "/fit/"+testID, "")
	v := decode(t, w)
	if w.Code != 200 || v["id"] != testID || v["createdAt"] != "2026-10-25T12:30:00.123" || v["cavalo"] != 80. {
		t.Fatal(v)
	}
	w = request(a, "GET", "/fit/not-a-uuid", "")
	if w.Code != 400 {
		t.Fatal(w)
	}
}
func TestFitCreate(t *testing.T) {
	a, m := mockApp(t)
	m.ExpectExec("INSERT INTO `tb_bikefit`").WithArgs(near(70.64), 60., 80., sqlmock.AnyArg(), "test@example.com", 100., sqlmock.AnyArg(), near(17.1653543132), near(53.6), 44.).WillReturnResult(sqlmock.NewResult(1, 1))
	m.ExpectQuery("SELECT \\* FROM tb_bikefit WHERE id=\\?").WillReturnRows(sqlmock.NewRows([]string{"id", "quadro_speed", "quadro_mtb", "altura_selim", "top_tube_efetivo"}).AddRow(testID, 53.6, 17.1653543132, 70.64, 44.))
	w := request(a, "POST", "/fit", `{"cavalo":80,"esterno":100,"braco":60,"email":"test@example.com"}`)
	if w.Code != 201 || !strings.HasPrefix(w.Header().Get("Location"), "/fit/") {
		t.Fatal(w)
	}
	if num(decode(t, w), "alturaSelim") != 70.64 {
		t.Fatal(w.Body.String())
	}
}
func TestMessagePage(t *testing.T) {
	a, m := mockApp(t)
	m.ExpectQuery("SELECT m\\.\\*").WithArgs(testID, 5, 5).WillReturnRows(sqlmock.NewRows([]string{"id", "mensagem", "curtida", "total_likes"}).AddRow(testID, "Olá", 1, 3))
	m.ExpectQuery("SELECT COUNT").WillReturnRows(sqlmock.NewRows([]string{"total"}).AddRow(12))
	w := request(a, "GET", "/mensagem?page=1&size=5", "", "X-Visitante-Id", testID)
	v := decode(t, w)
	pg := v["page"].(map[string]any)
	msg := v["content"].([]any)[0].(map[string]any)
	if pg["totalPages"] != 3. || pg["number"] != 1. || msg["curtida"] != true || msg["totalLikes"] != 3. {
		t.Fatal(v)
	}
}
func TestLikeTransactions(t *testing.T) {
	for _, liked := range []bool{false, true} {
		t.Run(fmt.Sprint(liked), func(t *testing.T) {
			a, m := mockApp(t)
			m.ExpectBegin()
			m.ExpectQuery("SELECT id FROM tb_mensagem WHERE id=\\? FOR UPDATE").WithArgs(binaryID()).WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(binaryID()))
			deleted := int64(1)
			if liked {
				deleted = 0
			}
			m.ExpectExec("DELETE FROM tb_mensagem_like").WithArgs(binaryID(), testID).WillReturnResult(sqlmock.NewResult(0, deleted))
			if liked {
				m.ExpectExec("INSERT INTO tb_mensagem_like").WithArgs(sqlmock.AnyArg(), binaryID(), testID).WillReturnResult(sqlmock.NewResult(1, 1))
			}
			m.ExpectQuery("SELECT COUNT").WithArgs(binaryID()).WillReturnRows(sqlmock.NewRows([]string{"total"}).AddRow(2))
			m.ExpectCommit()
			w := request(a, "POST", "/mensagem/"+testID+"/like", "", "X-Visitante-Id", testID)
			v := decode(t, w)
			if w.Code != 200 || v["curtida"] != liked {
				t.Fatal(v)
			}
		})
	}
}
func TestPetAuthorization(t *testing.T) {
	a, m := mockApp(t)
	at := time.Date(2026, 1, 2, 3, 4, 0, 0, time.Local)
	m.ExpectBegin()
	m.ExpectQuery("SELECT created_at FROM pets").WithArgs(binaryID()).WillReturnRows(sqlmock.NewRows([]string{"created_at"}).AddRow(at))
	m.ExpectRollback()
	w := request(a, "DELETE", "/pets/"+testID+"?secret=incorrect", "")
	if w.Code != 403 {
		t.Fatal(w)
	}
	m.ExpectBegin()
	m.ExpectQuery("SELECT created_at FROM pets").WithArgs(binaryID()).WillReturnRows(sqlmock.NewRows([]string{"created_at"}).AddRow(at))
	m.ExpectExec("DELETE FROM contacts WHERE pet_id=\\?").WithArgs(binaryID()).WillReturnResult(sqlmock.NewResult(0, 2))
	m.ExpectExec("DELETE FROM pets WHERE id=\\?").WithArgs(binaryID()).WillReturnResult(sqlmock.NewResult(0, 1))
	m.ExpectCommit()
	w = request(a, "DELETE", "/pets/"+testID+"?secret=20260102T0304", "")
	if w.Code != 200 {
		t.Fatal(w)
	}
}
func TestPetPublicJSON(t *testing.T) {
	a, m := mockApp(t)
	m.ExpectQuery("SELECT id,name,type,is_community,more_info FROM pets").WithArgs(binaryID()).WillReturnRows(sqlmock.NewRows([]string{"id", "name", "type", "is_community", "more_info"}).AddRow(testID, "Rex", "dog", 1, nil))
	m.ExpectQuery("SELECT id,name,contact_number,email,chat_app,location FROM contacts").WithArgs(binaryID()).WillReturnRows(sqlmock.NewRows([]string{"id", "name", "email", "chat_app"}).AddRow(testID, "Dono", "a@example.com", `["WhatsApp","Telegram"]`))
	w := request(a, "GET", "/pets/pet/"+testID, "")
	v := decode(t, w)
	if v["id"] != nil || v["isCommunity"] != true {
		t.Fatal(v)
	}
	c := v["contacts"].([]any)[0].(map[string]any)
	if c["id"] != nil || len(c["chatApp"].([]any)) != 2 {
		t.Fatal(c)
	}
}
func TestLoanCalculations(t *testing.T) {
	for _, rate := range []float64{0, .000001, .01, .05, .149999} {
		n := 84
		principal := 20000.
		payment := principal / float64(n)
		if rate > 0 {
			payment = principal * rate / (1 - math.Pow(1+rate, -float64(n)))
		}
		got, e := loanRate(n, payment, principal)
		if e != nil || math.Abs(got-rate) > 1e-10 {
			t.Fatalf("rate=%g got=%g err=%v", rate, got, e)
		}
	}
	if _, e := loanRate(12, 10, 1000); e == nil {
		t.Fatal("impossible loan accepted")
	}
	m := object{"codigoBanco": "001", "proximaParcela": "2026-10-25", "ultimaParcela": "2027-09-25", "quantidadeParcelas": 12., "valorParcela": 10000., "valorEmprestado": 120000.}
	if e := calculateLoan(m); e != "" {
		t.Fatal(e)
	}
	if m["taxaJuros"] != 0. || m["saldoDevedor"] != -1200. || m["mesesEmSer"] != 12 {
		t.Fatal(m)
	}
	v := loanResponse(m)
	if v["saldoDevedor"] != 1200. {
		t.Fatal(v)
	}
	m["ultimaParcela"] = "2026-01-01"
	if got := calculateLoan(m); got != "pcd.erro.datas" {
		t.Fatal(got)
	}
}
func TestJavaLocalDateTimeSecrets(t *testing.T) {
	for _, tc := range []struct{ stamp, secret string }{{"2026-01-02T03:04:00", "20260102T0304"}, {"2026-01-02T03:04:05", "20260102T030405"}, {"2026-01-02T03:04:00.123", "20260102T030400123"}, {"2026-01-02T03:04:05.123400", "20260102T030405123400"}, {"2026-01-02T03:04:05.000001", "20260102T030405000001"}} {
		at, e := time.Parse("2006-01-02T15:04:05.999999999", tc.stamp)
		if e != nil {
			t.Fatal(e)
		}
		if s := petSecret(at); s != tc.secret {
			t.Errorf("%s: %s", tc.stamp, s)
		}
	}
}
func TestParseBanks(t *testing.T) {
	for _, sep := range []string{",", ";"} {
		s := "a,b,c,d,e,f,g\n123,Banco,001,Sim,Direto,Banco Completo,01/01/2000\n321,Outro,n/a,Sim,Direto,Outro Banco,01/01/2000\n"
		rows, e := parseBanks([]byte(strings.ReplaceAll(s, ",", sep)))
		if e != nil || len(rows) != 1 || rows[0][2] != "001" {
			t.Fatalf("%v %v", rows, e)
		}
	}
	if _, e := parseBanks([]byte("<html>service unavailable</html>")); e == nil {
		t.Fatal("invalid CSV accepted")
	}
}
func TestJavaListFixture(t *testing.T) {
	b, e := os.ReadFile("testdata/chat-app-java.bin")
	if e != nil {
		t.Fatal(e)
	}
	items, e := decodeJavaList(b)
	want := []any{"WhatsApp", "Telegram", "WhatsApp", "🐶\x00ç", nil}
	if e != nil || !reflect.DeepEqual(items, want) {
		t.Fatalf("%v %v", items, e)
	}
	got, e := encodeJavaList(want)
	if e != nil {
		t.Fatal(e)
	}
	round, e := decodeJavaList(got)
	if e != nil || !reflect.DeepEqual(round, want) {
		t.Fatalf("%v %v", round, e)
	}
	if _, e = decodeJavaList([]byte{0xac, 0xed, 0, 5}); e == nil {
		t.Fatal("invalid Java object accepted")
	}
	for _, s := range []string{"[\"WhatsApp\"]", "null"} {
		if _, e := decodeChat(s); e != nil {
			t.Fatal(e)
		}
	}
}
func TestSchemaIsReadOnlyAndValidates(t *testing.T) {
	for _, missing := range []bool{false, true} {
		t.Run(fmt.Sprint(missing), func(t *testing.T) {
			a, m := mockApp(t)
			rows := sqlmock.NewRows([]string{"TABLE_NAME", "COLUMN_NAME", "DATA_TYPE"})
			for table, cols := range requiredSchema {
				for _, c := range cols {
					if missing && table == "pets" && c == "name" {
						continue
					}
					dt := "varchar"
					if c == "id" {
						dt = "binary"
					}
					if c == "chat_app" {
						dt = "varbinary"
					}
					rows.AddRow(table, c, dt)
				}
			}
			m.ExpectQuery("SELECT TABLE_NAME,COLUMN_NAME,DATA_TYPE FROM information_schema").WillReturnRows(rows)
			e := a.inspectSchema()
			if missing && e == nil || !missing && e != nil {
				t.Fatal(e)
			}
		})
	}
}

type near float64

func (n near) Match(v driver.Value) bool {
	x, ok := v.(float64)
	return ok && math.Abs(x-float64(n)) < 1e-9
}
func TestCompression(t *testing.T) {
	a := &app{}
	w := request(a, "GET", "/pcd/", "", "Accept-Encoding", "gzip")
	if w.Code != 200 || w.Header().Get("Content-Encoding") != "gzip" {
		t.Fatal(w)
	}
	z, e := gzip.NewReader(w.Body)
	if e != nil {
		t.Fatal(e)
	}
	defer z.Close()
	b, e := io.ReadAll(z)
	if e != nil || !strings.Contains(string(b), "<html") {
		t.Fatalf("%s %v", b, e)
	}
	w = request(a, "GET", "/app.js", "", "Accept-Encoding", "gzip;q=0")
	if w.Header().Get("Content-Encoding") != "" {
		t.Fatal(w)
	}
}
func TestConfigPrecedence(t *testing.T) {
	path := t.TempDir() + "/application.properties"
	e := os.WriteFile(path, []byte("spring.datasource.url=jdbc:mysql://db.internal:3307/existing\nspring.datasource.username=previous\nspring.datasource.password=password-from-file\nserver.port=8090\nnograu.base-url=https://example.com\n"), 0600)
	if e != nil {
		t.Fatal(e)
	}
	t.Setenv("NOGRAU_CONFIG", path)
	t.Setenv("SPRING_DATASOURCE_USERNAME", "override")
	t.Setenv("MYSQL_DSN", "")
	t.Setenv("HTTP_ADDR", ":8091")
	c, e := loadConfig()
	if e != nil {
		t.Fatal(e)
	}
	if !strings.Contains(c.dsn, "override:password-from-file@tcp(db.internal:3307)/existing") || c.addr != ":8091" || c.baseURL != "https://example.com" {
		t.Fatal("incorrect config precedence")
	}
}

func TestLoanHTTPUnits(t *testing.T) {
	a, m := mockApp(t)
	m.ExpectExec("INSERT INTO `tb_calculo_emprestimo`").WithArgs("001", sqlmock.AnyArg(), sqlmock.AnyArg(), 12, "2026-10-25", 12., -1200., 0., "2027-09-25", 1200., 100.).WillReturnResult(sqlmock.NewResult(1, 1))
	m.ExpectQuery("SELECT \\* FROM tb_calculo_emprestimo").WillReturnRows(sqlmock.NewRows([]string{"id", "taxa_juros", "saldo_devedor", "valor_parcela", "valor_emprestado"}).AddRow(testID, 0., -1200., 100., 1200.))
	w := request(a, "POST", "/pcd/calculo", `{"codigoBanco":"001","proximaParcela":"2026-10-25","ultimaParcela":"2027-09-25","quantidadeParcelas":12,"valorParcela":10000,"valorEmprestado":120000}`)
	v := decode(t, w)
	if w.Code != 200 || v["saldoDevedor"] != 1200. || v["valorParcela"] != 100. || v["valorEmprestado"] != 1200. {
		t.Fatal(v)
	}
}
func TestPetUpdateRollsBackContactsOnFailure(t *testing.T) {
	a, m := mockApp(t)
	at := time.Date(2026, 1, 2, 3, 4, 0, 0, time.Local)
	m.ExpectBegin()
	m.ExpectQuery("SELECT created_at FROM pets").WithArgs(binaryID()).WillReturnRows(sqlmock.NewRows([]string{"created_at"}).AddRow(at))
	m.ExpectExec("UPDATE pets SET").WillReturnResult(sqlmock.NewResult(0, 1))
	m.ExpectExec("DELETE FROM contacts WHERE pet_id").WithArgs(binaryID()).WillReturnResult(sqlmock.NewResult(0, 1))
	m.ExpectExec("INSERT INTO contacts").WillReturnError(fmt.Errorf("simulated database failure"))
	m.ExpectRollback()
	w := request(a, "PUT", "/pets/"+testID+"?secret=20260102T0304", `{"name":"Rex","type":"dog","contacts":[{"name":"Dono","email":"a@example.com","chatApp":["WhatsApp"]}]}`)
	if w.Code != 500 {
		t.Fatal(w)
	}
}

func TestPortOverride(t *testing.T) {
	for _, tc := range []struct{ addr, port, want string }{
		{":8080", "9090", ":9090"},
		{"127.0.0.1:8091", "9090", "127.0.0.1:9090"},
		{"[::1]:8080", "9090", "[::1]:9090"},
	} {
		got, err := addressWithPort(tc.addr, tc.port)
		if err != nil || got != tc.want {
			t.Fatalf("got %q, %v; want %q", got, err, tc.want)
		}
	}
	for _, port := range []string{"0", "-1", "65536", "abc", "9090:8080"} {
		if _, err := addressWithPort(":8080", port); err == nil {
			t.Errorf("accepted invalid port %q", port)
		}
	}
}

func TestReplyIDFromBodyAndLegacyQuery(t *testing.T) {
	for _, useQuery := range []bool{false, true} {
		t.Run(fmt.Sprint(useQuery), func(t *testing.T) {
			a, m := mockApp(t)
			m.ExpectExec("INSERT INTO `tb_mensagem`").WithArgs(sqlmock.AnyArg(), "reply@example.com", sqlmock.AnyArg(), binaryID(), "Resposta", "Autor").WillReturnResult(sqlmock.NewResult(1, 1))
			m.ExpectQuery("SELECT nome,email FROM tb_mensagem WHERE id=\\?").WithArgs(binaryID()).WillReturnRows(sqlmock.NewRows([]string{"nome", "email"}).AddRow("Original", "original@example.com"))
			path := "/mensagem"
			payload := `{"nome":"Autor","email":"reply@example.com","mensagem":"Resposta","idResposta":"` + testID + `"}`
			if useQuery {
				path += "?idResposta=" + testID
				payload = `{"nome":"Autor","email":"reply@example.com","mensagem":"Resposta"}`
			}
			w := request(a, "POST", path, payload)
			if w.Code != 204 {
				t.Fatalf("%d %s", w.Code, w.Body.String())
			}
		})
	}
}
func TestSMTPPropertiesAndEnv(t *testing.T) {
	path := t.TempDir() + "/application.properties"
	e := os.WriteFile(path, []byte("spring.mail.host=smtp.gmail.com\nspring.mail.port=587\nspring.mail.username=sender@example.com\nspring.mail.password=test-password\nspring.mail.properties.mail.smtp.starttls.enable=true\nnograu.mail.from=sender@example.com\n"), 0600)
	if e != nil {
		t.Fatal(e)
	}
	t.Setenv("NOGRAU_CONFIG", path)
	for _, k := range []string{"SPRING_MAIL_HOST", "SPRING_MAIL_PORT", "SPRING_MAIL_USERNAME", "SPRING_MAIL_PASSWORD", "SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE", "NOGRAU_MAIL_FROM"} {
		old, exists := os.LookupEnv(k)
		os.Unsetenv(k)
		t.Cleanup(func() {
			if exists {
				os.Setenv(k, old)
			} else {
				os.Unsetenv(k)
			}
		})
	}
	c, e := loadConfig()
	if e != nil {
		t.Fatal(e)
	}
	if c.mailHost != "smtp.gmail.com" || c.mailPort != "587" || c.mailUser != "sender@example.com" || c.mailPassword != "test-password" || !c.mailTLS || c.mailFrom != "sender@example.com" {
		t.Fatal("SMTP properties not loaded correctly")
	}
	t.Setenv("SPRING_MAIL_PASSWORD", "override-password")
	c, e = loadConfig()
	if e != nil {
		t.Fatal(e)
	}
	if c.mailPassword != "override-password" {
		t.Fatal("SMTP environment override ignored")
	}
}
