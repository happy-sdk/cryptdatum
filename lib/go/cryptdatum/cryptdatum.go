// SPDX-License-Identifier: Apache-2.0
//
// Copyright © 2022 The Happy Authors

package cryptdatum

import (
	"bytes"
	"encoding/binary"
	"errors"
	"fmt"
)

const (
	// Version is the current version of the Cryptdatum format.
	// Implementations of the Cryptdatum library should set the version field in
	// Cryptdatum headers to this value.
	Version uint16 = 1

	// MinVersion is the minimum supported version of the Cryptdatum format.
	// If the version field in a Cryptdatum header is lower than this value, the
	// header should be considered invalid.
	MinVersion uint16 = 1

	// HeaderSize is the size of a Cryptdatum header in bytes. It can be used by
	// implementations of the Cryptdatum library to allocate sufficient memory for
	// a Cryptdatum header, or to check the size of a Cryptdatum header that has
	// been read from a stream.
	HeaderSize int = 64

	// MagicDate is date which datum can not be older. Therefore it is the minimum
	// value possible for Header.Timestamp
	MagicDate uint64 = 1652155382000000001
)

type DatumFlag uint64

const (
	DatumInvalid DatumFlag = 1 << iota
	DatumDraft
	DatumEmpty
	DatumChecksum
	DatumOPC
	DatumCompressed
	DatumEncrypted
	DatumExtractable
	DatumSigned
	DatumChunked
	DatumMetadata
	DatumCompromised
	DatumBigEndian
	DatumNetwork
)

var (
	// magic is the magic number used to identify Cryptdatum headers. If the magic
	// number field in a Cryptdatum header does not match this value, the header
	// should be considered invalid.
	magic = [4]byte{0xA7, 0xF6, 0xE5, 0xD4}

	// delimiter is the delimiter used to mark the end of a Cryptdatum header. If
	// the delimiter field in a Cryptdatum header does not match this value, the
	// header should be considered invalid.
	delimiter = [2]byte{0xA6, 0xE5}

	// empty
	empty8 = [8]byte{0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00}
	empty2 = [2]byte{0x00, 0x00}
)

var (
	Error            = errors.New("cryptdatum")
	ErrIO            = fmt.Errorf("%w i/o", Error)
	ErrEOF           = fmt.Errorf("%w EOF", Error)
	ErrFormat        = fmt.Errorf("%w unsupported data format", Error)
	ErrInvalidHeader = fmt.Errorf("%w invalid header", Error)
)

type Header struct {
}

func HasHeader(data []byte) bool {
	if len(data) < HeaderSize {
		return false
	}
	return magic == [4]byte(data[:4]) && delimiter == [2]byte(data[62:HeaderSize])
}

func HasValidHeader(data []byte) bool {
	if !HasHeader(data) {
		return false
	}
	return true
}

type header struct {
	Magic     [4]byte
	Version   uint16
	Flags     uint16
	Reserved1 [54]byte
	Delimiter [2]byte
}

// ParseHeader parses the byte slice into a Header struct.
func ParseHeader(buf []byte) (Header, error) {
	if len(data) < HeaderSize {
		return Header{}, errors.New("buffer too short")
	}

	var h header
	reader := bytes.NewReader(data[:HeaderSize])
	if err := binary.Read(reader, binary.LittleEndian, &h); err != nil {
		return nil, err
	}
	fmt.Printf("%v\n", h)

	return &h, nil
}

type Reader struct{}

func ReadAll(r Reader) ([]byte, error) { return nil, nil }

type Writer struct{}
