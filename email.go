package main

import (
	"crypto/tls"
	"fmt"
	"log"
	"mime"
	"net"
	"net/mail"
	"net/smtp"
	"strings"
	"time"
)

var mailSlots = make(chan struct{}, 4)

func (a *app) sendMail(to, subject, body string) {
	if a.cfg.mailHost == "" {
		log.Print("SMTP não configurado; notificação não enviada")
		return
	}
	select {
	case mailSlots <- struct{}{}:
	default:
		log.Print("Fila de SMTP cheia; notificação não enviada")
		return
	}
	go func() {
		defer func() { <-mailSlots }()
		if e := a.deliverMail(to, subject, body); e != nil {
			log.Printf("Falha ao enviar notificação: %v", e)
		} else {
			log.Print("Notificação aceita pelo servidor SMTP")
		}
	}()
}
func (a *app) deliverMail(to, subject, body string) error {
	recipient, e := mail.ParseAddress(to)
	if e != nil {
		return e
	}
	sender, e := mail.ParseAddress(a.cfg.mailFrom)
	if e != nil {
		return e
	}
	conn, e := net.DialTimeout("tcp", net.JoinHostPort(a.cfg.mailHost, a.cfg.mailPort), 10*time.Second)
	if e != nil {
		return e
	}
	defer conn.Close()
	conn.SetDeadline(time.Now().Add(30 * time.Second))
	client, e := smtp.NewClient(conn, a.cfg.mailHost)
	if e != nil {
		return e
	}
	defer client.Close()
	if a.cfg.mailTLS {
		if e = client.StartTLS(&tls.Config{ServerName: a.cfg.mailHost, MinVersion: tls.VersionTLS12}); e != nil {
			return e
		}
	}
	if a.cfg.mailUser != "" {
		if e = client.Auth(smtp.PlainAuth("", a.cfg.mailUser, a.cfg.mailPassword, a.cfg.mailHost)); e != nil {
			return fmt.Errorf("autenticação SMTP: %w", e)
		}
	}
	if e = client.Mail(sender.Address); e != nil {
		return e
	}
	if e = client.Rcpt(recipient.Address); e != nil {
		return e
	}
	w, e := client.Data()
	if e != nil {
		return e
	}
	subject = strings.NewReplacer("\r", "", "\n", "").Replace(subject)
	_, e = fmt.Fprintf(w, "From: %s\r\nTo: %s\r\nSubject: %s\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n%s\r\n", sender.String(), recipient.String(), mime.QEncoding.Encode("UTF-8", subject), strings.ReplaceAll(strings.ReplaceAll(body, "\r\n", "\n"), "\n", "\r\n"))
	if e != nil {
		return e
	}
	if e = w.Close(); e != nil {
		return e
	}
	return client.Quit()
}

func (a *app) logMailConfig() {
	if a.cfg.mailHost == "" {
		log.Print("SMTP desativado: configure spring.mail.host ou SPRING_MAIL_HOST; notificações não serão enviadas")
		return
	}
	log.Printf("SMTP: servidor=%s porta=%s STARTTLS=%t autenticação=%t senha_configurada=%t", a.cfg.mailHost, a.cfg.mailPort, a.cfg.mailTLS, a.cfg.mailUser != "", a.cfg.mailPassword != "")
	if a.cfg.mailUser != "" && a.cfg.mailPassword == "" {
		log.Print("SMTP: usuário configurado sem senha; confira spring.mail.password ou SPRING_MAIL_PASSWORD")
	}
}
