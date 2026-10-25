package main

import (
	"crypto/subtle"
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"
	"time"
)

func jsonWrite(w http.ResponseWriter, v any) { check(json.NewEncoder(w).Encode(v)) }
func (a *app) pet(id string) object {
	p := one(a.query("SELECT id,name,type,is_community,more_info FROM pets WHERE id=?", a.id("pets", "id", id)))
	switch b := p["isCommunity"].(type) {
	case int64:
		p["isCommunity"] = b != 0
	case uint64:
		p["isCommunity"] = b != 0
	case string:
		p["isCommunity"] = b != "0" && b != "\x00"
	}
	contacts := a.query("SELECT id,name,contact_number,email,chat_app,location FROM contacts WHERE pet_id=?", a.id("contacts", "pet_id", id))
	for _, c := range contacts {
		chats, e := decodeChat(c["chatApp"])
		check(e)
		c["chatApp"] = chats
	}
	p["contacts"] = contacts
	return p
}
func petSecret(t time.Time) string {
	s := localDateTime(t)
	return strings.Map(func(r rune) rune {
		if r >= '0' && r <= '9' || r >= 'a' && r <= 'z' || r >= 'A' && r <= 'Z' {
			return r
		}
		return -1
	}, s)
}
func (a *app) authorizePet(tx *sql.Tx, r *http.Request, id string) {
	var t time.Time
	e := tx.QueryRow("SELECT created_at FROM pets WHERE id=? FOR UPDATE", a.id("pets", "id", id)).Scan(&t)
	if e == sql.ErrNoRows {
		panic(failure{404, "Pet not found"})
	}
	check(e)
	if subtle.ConstantTimeCompare([]byte(petSecret(t)), []byte(r.URL.Query().Get("secret"))) != 1 {
		panic(failure{403, "Invalid secret"})
	}
}
func validatePet(m object) {
	if strings.TrimSpace(text(m, "name")) == "" || strings.TrimSpace(text(m, "type")) == "" {
		bad("name e type são obrigatórios")
	}
	if v := m["isCommunity"]; v != nil {
		if _, ok := v.(bool); !ok {
			bad("isCommunity inválido")
		}
	}
	if m["contacts"] == nil {
		m["contacts"] = []any{}
	}
	cs, ok := m["contacts"].([]any)
	if !ok {
		bad("contacts inválido")
	}
	for _, c := range cs {
		v, ok := c.(map[string]any)
		if !ok || strings.TrimSpace(text(v, "name")) == "" || strings.TrimSpace(text(v, "email")) == "" {
			bad("Nome e e-mail do contato são obrigatórios")
		}
		if chats := v["chatApp"]; chats != nil {
			arr, ok := chats.([]any)
			if !ok {
				bad("chatApp inválido")
			}
			for _, s := range arr {
				if _, ok := s.(string); !ok {
					bad("chatApp inválido")
				}
			}
		}
	}
}
func (a *app) saveContacts(tx *sql.Tx, id string, m object) {
	for _, c := range m["contacts"].([]any) {
		v := c.(map[string]any)
		cid := text(v, "id")
		if cid == "" {
			cid = uuid()
		}
		chat, e := a.encodeChat(v["chatApp"])
		check(e)
		_, e = tx.Exec("INSERT INTO contacts(id,name,contact_number,email,chat_app,location,created_at,updated_at,pet_id) VALUES(?,?,?,?,?,?,?,?,?)", a.id("contacts", "id", cid), v["name"], v["contactNumber"], v["email"], chat, v["location"], now(), now(), a.id("contacts", "pet_id", id))
		check(e)
	}
}
func (a *app) petCreate(w http.ResponseWriter, r *http.Request) any {
	m := body(r)
	validatePet(m)
	id := uuid()
	tx, e := a.db.BeginTx(r.Context(), nil)
	check(e)
	defer tx.Rollback()
	_, e = tx.Exec("INSERT INTO pets(id,name,type,is_community,more_info,created_at,updated_at) VALUES(?,?,?,?,?,?,?)", a.id("pets", "id", id), m["name"], m["type"], m["isCommunity"], m["moreInfo"], now(), now())
	check(e)
	a.saveContacts(tx, id, m)
	check(tx.Commit())
	p := a.pet(id)
	a.petMail(r, p)
	return p
}
func (a *app) petUpdate(w http.ResponseWriter, r *http.Request) any {
	id := r.PathValue("id")
	m := body(r)
	validatePet(m)
	tx, e := a.db.BeginTx(r.Context(), nil)
	check(e)
	defer tx.Rollback()
	a.authorizePet(tx, r, id)
	_, e = tx.Exec("UPDATE pets SET name=?,type=?,is_community=?,more_info=?,updated_at=? WHERE id=?", m["name"], m["type"], m["isCommunity"], m["moreInfo"], now(), a.id("pets", "id", id))
	check(e)
	_, e = tx.Exec("DELETE FROM contacts WHERE pet_id=?", a.id("contacts", "pet_id", id))
	check(e)
	a.saveContacts(tx, id, m)
	check(tx.Commit())
	p := a.pet(id)
	a.petMail(r, p)
	return p
}
func (a *app) petDelete(w http.ResponseWriter, r *http.Request) any {
	id := r.PathValue("id")
	tx, e := a.db.BeginTx(r.Context(), nil)
	check(e)
	defer tx.Rollback()
	a.authorizePet(tx, r, id)
	_, e = tx.Exec("DELETE FROM contacts WHERE pet_id=?", a.id("contacts", "pet_id", id))
	check(e)
	_, e = tx.Exec("DELETE FROM pets WHERE id=?", a.id("pets", "id", id))
	check(e)
	check(tx.Commit())
	w.WriteHeader(200)
	return nil
}
func (a *app) petMail(r *http.Request, p object) {
	t := scanTime(a.db, "SELECT created_at FROM pets WHERE id=?", a.id("pets", "id", text(p, "id")))
	link := strings.TrimRight(a.cfg.baseURL, "/") + "/tagpet/pet/pet-form.html?id=" + text(p, "id") + "&secret=" + petSecret(t)
	subject := strings.ReplaceAll(a.message(r, "tagpet.email.subject"), "{0}", text(p, "name"))
	body := strings.ReplaceAll(strings.ReplaceAll(strings.ReplaceAll(a.message(r, "tagpet.email.body"), "{0}", text(p, "name")), "{1}", link), `\n`, "\n")
	body = strings.ReplaceAll(body, "''", "'")
	for _, c := range p["contacts"].([]object) {
		if email := text(c, "email"); email != "" {
			a.sendMail(email, subject, body)
		}
	}
}
