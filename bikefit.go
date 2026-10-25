package main

import (
	"database/sql"
	"net/http"
	"net/mail"
	"strings"
)

func (a *app) fitCreate(w http.ResponseWriter, r *http.Request) any {
	m := body(r)
	errors := object{}
	for k, bounds := range map[string][2]float64{"cavalo": {60, 115}, "esterno": {45, 165}, "braco": {40, 100}} {
		v, ok := m[k].(float64)
		if !ok || v < bounds[0] || v > bounds[1] {
			errors[k] = "Medida fora do intervalo permitido"
		}
	}
	email := text(m, "email")
	addr, e := mail.ParseAddress(email)
	if e != nil || addr.Address != email {
		errors["email"] = "E-mail inválido"
	}
	if len(errors) > 0 {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(400)
		jsonWrite(w, object{"message": a.message(r, "error.validacao"), "errors": errors})
		return nil
	}
	id := uuid()
	c, s, b := num(m, "cavalo"), num(m, "esterno"), num(m, "braco")
	a.insert("tb_bikefit", object{"id": a.id("tb_bikefit", "id", id), "cavalo": c, "esterno": s, "braco": b, "email": email, "quadro_speed": c * .67, "quadro_mtb": (c*.67 - 10) * .393700787, "altura_selim": c * .883, "top_tube_efetivo": (s-c+b)/2 + 4, "created_at": now()})
	result := one(a.query("SELECT * FROM tb_bikefit WHERE id=?", a.id("tb_bikefit", "id", id)))
	w.Header().Set("Location", "/fit/"+id)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(201)
	jsonWrite(w, result)
	return nil
}
func (a *app) messageSQL() string {
	return "SELECT m.*, (SELECT COUNT(*) FROM tb_mensagem_like l WHERE l.mensagem_id=m.id) AS total_likes, EXISTS(SELECT 1 FROM tb_mensagem_like l WHERE l.mensagem_id=m.id AND l.visitante_id=?) AS curtida FROM tb_mensagem m"
}
func normalizeMessages(rows []object) []object {
	for _, m := range rows {
		m["curtida"] = num(m, "curtida") != 0
	}
	return rows
}
func (a *app) messages(w http.ResponseWriter, r *http.Request) any {
	page, size := pageInt(r.URL.Query().Get("page"), 0), pageInt(r.URL.Query().Get("size"), 10)
	if size == 0 {
		size = 10
	}
	if size > 2000 {
		size = 2000
	}
	if page > 10000000 {
		bad("Página inválida")
	}
	rows := normalizeMessages(a.query(a.messageSQL()+" ORDER BY m.created_at DESC LIMIT ? OFFSET ?", r.Header.Get("X-Visitante-Id"), size, page*size))
	total := int(num(one(a.query("SELECT COUNT(*) AS total FROM tb_mensagem")), "total"))
	pages := (total + size - 1) / size
	return object{"content": rows, "page": object{"size": size, "number": page, "totalElements": total, "totalPages": pages}, "size": size, "number": page, "totalElements": total, "totalPages": pages, "first": page == 0, "last": page+1 >= pages, "empty": len(rows) == 0, "numberOfElements": len(rows)}
}
func (a *app) messageCreate(w http.ResponseWriter, r *http.Request) any {
	m := body(r)
	for _, k := range []string{"mensagem", "nome", "email"} {
		if _, ok := m[k].(string); !ok {
			bad("Campo obrigatório: " + k)
		}
	}
	// Accept the query parameter used by cached versions of the site.
	replyID := text(m, "idResposta")
	if replyID == "" {
		replyID = r.URL.Query().Get("idResposta")
	}
	var reply any
	if replyID != "" {
		reply = a.id("tb_mensagem", "id_resposta", replyID)
	}
	a.insert("tb_mensagem", object{"id": a.id("tb_mensagem", "id", uuid()), "mensagem": m["mensagem"], "nome": m["nome"], "email": m["email"], "id_resposta": reply, "created_at": now()})
	if reply != nil {
		original := a.query("SELECT nome,email FROM tb_mensagem WHERE id=?", a.id("tb_mensagem", "id", replyID))
		if len(original) > 0 {
			a.sendMail(text(original[0], "email"), "Sua mensagem recebeu uma resposta!", "Olá, "+text(original[0], "nome")+"! Sua mensagem no mural do nograu.com.br recebeu uma resposta de "+text(m, "nome")+".")
		}
	}
	w.WriteHeader(204)
	return nil
}
func (a *app) like(w http.ResponseWriter, r *http.Request) any {
	id := a.id("tb_mensagem", "id", r.PathValue("id"))
	visitor := strings.ToLower(r.Header.Get("X-Visitante-Id"))
	if !validUUID(visitor) {
		bad("X-Visitante-Id deve ser um UUID")
	}
	tx, e := a.db.BeginTx(r.Context(), nil)
	check(e)
	defer tx.Rollback()
	var ignored any
	e = tx.QueryRow("SELECT id FROM tb_mensagem WHERE id=? FOR UPDATE", id).Scan(&ignored)
	if e == sql.ErrNoRows {
		panic(failure{404, "Mensagem não encontrada"})
	}
	check(e)
	mid := a.id("tb_mensagem_like", "mensagem_id", r.PathValue("id"))
	res, e := tx.Exec("DELETE FROM tb_mensagem_like WHERE mensagem_id=? AND visitante_id=?", mid, visitor)
	check(e)
	n, e := res.RowsAffected()
	check(e)
	liked := n == 0
	if liked {
		_, e = tx.Exec("INSERT INTO tb_mensagem_like(id,mensagem_id,visitante_id) VALUES(?,?,?)", a.id("tb_mensagem_like", "id", uuid()), mid, visitor)
		check(e)
	}
	var count int64
	check(tx.QueryRow("SELECT COUNT(*) FROM tb_mensagem_like WHERE mensagem_id=?", mid).Scan(&count))
	check(tx.Commit())
	return object{"totalLikes": count, "curtida": liked}
}
