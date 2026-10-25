package main

import (
	"compress/gzip"
	"net/http"
	"strconv"
	"strings"
)

type gzipResponse struct {
	http.ResponseWriter
	writer  *gzip.Writer
	decided bool
}

func (w *gzipResponse) WriteHeader(status int) {
	if w.decided {
		return
	}
	w.decided = true
	ct := w.Header().Get("Content-Type")
	if status >= 200 && status != 204 && (strings.HasPrefix(ct, "text/") || strings.Contains(ct, "javascript") || strings.Contains(ct, "json") || strings.Contains(ct, "svg+xml")) {
		w.Header().Del("Content-Length")
		w.Header().Set("Content-Encoding", "gzip")
		w.writer = gzip.NewWriter(w.ResponseWriter)
	}
	w.ResponseWriter.WriteHeader(status)
}
func (w *gzipResponse) Write(b []byte) (int, error) {
	if !w.decided {
		if w.Header().Get("Content-Type") == "" {
			w.Header().Set("Content-Type", http.DetectContentType(b))
		}
		w.WriteHeader(200)
	}
	if w.writer != nil {
		return w.writer.Write(b)
	}
	return w.ResponseWriter.Write(b)
}
func acceptsGzip(s string) bool {
	for _, part := range strings.Split(s, ",") {
		fields := strings.Split(strings.TrimSpace(part), ";")
		if fields[0] != "gzip" {
			continue
		}
		for _, param := range fields[1:] {
			if k, v, ok := strings.Cut(strings.TrimSpace(param), "="); ok && k == "q" {
				q, e := strconv.ParseFloat(v, 64)
				if e != nil || q <= 0 {
					return false
				}
			}
		}
		return true
	}
	return false
}
func compression(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Vary", "Accept-Encoding")
		if r.Method == "HEAD" || r.Header.Get("Range") != "" || !acceptsGzip(r.Header.Get("Accept-Encoding")) {
			next.ServeHTTP(w, r)
			return
		}
		gz := &gzipResponse{ResponseWriter: w}
		defer func() {
			if gz.writer != nil {
				gz.writer.Close()
			}
		}()
		next.ServeHTTP(gz, r)
	})
}
