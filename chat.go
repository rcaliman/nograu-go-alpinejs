package main

import (
	"bytes"
	"encoding/binary"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"unicode/utf16"
)

// Hibernate 6 serializes a basic List<String> as java.util.ArrayList when
// MySQL has no native arrays. Hibernate 7 uses JSON. Preserve either format.
// This codec accepts only that fixed data format; it never instantiates Java objects.
var arrayListHeader = func() []byte {
	b, _ := hex.DecodeString("aced0005737200136a6176612e7574696c2e41727261794c6973747881d21d99c7619d03000149000473697a657870")
	return b
}()

func modifiedUTF(s string) []byte {
	out := []byte{}
	for _, c := range utf16.Encode([]rune(s)) {
		switch {
		case c >= 1 && c <= 127:
			out = append(out, byte(c))
		case c <= 2047:
			out = append(out, byte(192|c>>6), byte(128|c&63))
		default:
			out = append(out, byte(224|c>>12), byte(128|(c>>6)&63), byte(128|c&63))
		}
	}
	return out
}
func readModifiedUTF(b []byte) (string, error) {
	units := []uint16{}
	for i := 0; i < len(b); {
		c := b[i]
		switch {
		case c >= 1 && c < 128:
			units = append(units, uint16(c))
			i++
		case c&224 == 192 && i+1 < len(b) && b[i+1]&192 == 128:
			units = append(units, uint16(c&31)<<6|uint16(b[i+1]&63))
			i += 2
		case c&240 == 224 && i+2 < len(b) && b[i+1]&192 == 128 && b[i+2]&192 == 128:
			units = append(units, uint16(c&15)<<12|uint16(b[i+1]&63)<<6|uint16(b[i+2]&63))
			i += 3
		default:
			return "", fmt.Errorf("UTF Java inválido")
		}
	}
	return string(utf16.Decode(units)), nil
}
func encodeJavaList(items []any) ([]byte, error) {
	b := bytes.NewBuffer(append([]byte{}, arrayListHeader...))
	binary.Write(b, binary.BigEndian, uint32(len(items)))
	b.Write([]byte{0x77, 4})
	binary.Write(b, binary.BigEndian, uint32(len(items)))
	for _, item := range items {
		if item == nil {
			b.WriteByte(0x70)
			continue
		}
		s, ok := item.(string)
		if !ok {
			return nil, fmt.Errorf("chatApp contém valor não textual")
		}
		v := modifiedUTF(s)
		if len(v) <= 65535 {
			b.WriteByte(0x74)
			binary.Write(b, binary.BigEndian, uint16(len(v)))
		} else {
			b.WriteByte(0x7c)
			binary.Write(b, binary.BigEndian, uint64(len(v)))
		}
		b.Write(v)
	}
	b.WriteByte(0x78)
	return b.Bytes(), nil
}
func decodeJavaList(b []byte) ([]any, error) {
	fail := func() ([]any, error) { return nil, fmt.Errorf("contacts.chat_app: serialização Java não suportada") }
	if !bytes.HasPrefix(b, arrayListHeader) {
		return fail()
	}
	r := bytes.NewReader(b[len(arrayListHeader):])
	var n uint32
	if binary.Read(r, binary.BigEndian, &n) != nil || n > 10000 {
		return fail()
	}
	tag, e := r.ReadByte()
	if e != nil || tag != 0x77 {
		return fail()
	}
	size, e := r.ReadByte()
	if e != nil || size != 4 {
		return fail()
	}
	var repeat uint32
	if binary.Read(r, binary.BigEndian, &repeat) != nil || repeat != n {
		return fail()
	}
	out := make([]any, 0, n)
	handles := []string{}
	for i := uint32(0); i < n; i++ {
		tag, e = r.ReadByte()
		if e != nil {
			return fail()
		}
		switch tag {
		case 0x70:
			out = append(out, nil)
		case 0x71:
			var ref uint32
			if binary.Read(r, binary.BigEndian, &ref) != nil || ref < 0x7e0002 || int(ref-0x7e0002) >= len(handles) {
				return fail()
			}
			out = append(out, handles[ref-0x7e0002])
		case 0x74, 0x7c:
			var length uint64
			if tag == 0x74 {
				var v uint16
				if binary.Read(r, binary.BigEndian, &v) != nil {
					return fail()
				}
				length = uint64(v)
			} else if binary.Read(r, binary.BigEndian, &length) != nil {
				return fail()
			}
			if length > uint64(r.Len()) {
				return fail()
			}
			v := make([]byte, int(length))
			if _, e = io.ReadFull(r, v); e != nil {
				return fail()
			}
			s, e := readModifiedUTF(v)
			if e != nil {
				return nil, e
			}
			handles = append(handles, s)
			out = append(out, s)
		default:
			return fail()
		}
	}
	tag, e = r.ReadByte()
	if e != nil || tag != 0x78 || r.Len() != 0 {
		return fail()
	}
	return out, nil
}
func (a *app) encodeChat(v any) (any, error) {
	if v == nil {
		return nil, nil
	}
	switch a.columns["contacts"]["chat_app"] {
	case "binary", "varbinary", "blob", "mediumblob", "longblob":
		return encodeJavaList(v.([]any))
	default:
		b, e := json.Marshal(v)
		return string(b), e
	}
}
func decodeChat(v any) (any, error) {
	if v == nil {
		return nil, nil
	}
	var b []byte
	switch v := v.(type) {
	case string:
		b = []byte(v)
	case []byte:
		b = v
	default:
		return nil, fmt.Errorf("chatApp inválido")
	}
	if bytes.HasPrefix(b, []byte{0xac, 0xed}) {
		return decodeJavaList(b)
	}
	var list []any
	if e := json.Unmarshal(b, &list); e != nil {
		return nil, e
	}
	return list, nil
}
