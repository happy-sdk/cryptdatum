// SPDX-License-Identifier: Apache-2.0
//
// Copyright © 2022 The Happy Authors

package cryptdatum

import (
	"encoding/binary"
	"errors"
	"fmt"
	"io"
	"os"
	"sync"
	"time"
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
	// a Cryptdatum header, or to+ check the size of a Cryptdatum header that has
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
	zero8 = [8]byte{0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00}
	zero2 = [2]byte{0x00, 0x00}
)

var (
	Error            = errors.New("cryptdatum")
	ErrIO            = fmt.Errorf("%w i/o", Error)
	ErrEOF           = fmt.Errorf("%w EOF", Error)
	ErrFormat        = fmt.Errorf("%w unsupported data format", Error)
	ErrInvalidHeader = fmt.Errorf("%w invalid header", Error)

	ErrDatumInvalid     = fmt.Errorf("%w: DATUM INVALID flag is set in header", ErrInvalidHeader)
	ErrDatumDraft       = fmt.Errorf("%w: DATUM DRAFT flag is set in header", ErrInvalidHeader)
	ErrDatumCompromised = fmt.Errorf("%w: DATUM COMPROMISED flag is set in header", ErrInvalidHeader)
)

type Header struct {
	Flags                DatumFlag
	Timestamp            uint64
	Size                 uint64
	Version              uint16
	ChunkSize            uint16
	OperationCounter     uint32
	NetworkID            uint32
	MetadataSize         uint32
	Checksum             uint64
	CompressionAlgorithm uint16
	EncryptionAlgorithm  uint16
	SignatureType        uint16
	SignatureSize        uint16
	MetadataSpec         uint16
}

func (h Header) Validate() error {

	if h.Flags&DatumInvalid != 0 {
		return ErrDatumInvalid
	}

	if h.Flags&DatumDraft != 0 {
		return ErrDatumDraft
	}

	if h.Flags&DatumCompromised != 0 {
		return ErrDatumCompromised
	}

	if h.Timestamp < MagicDate {
		return fmt.Errorf("%w: datum timestamp %d is less than spec magic date %d", ErrInvalidHeader, h.Timestamp, MagicDate)
	}

	if h.Version < 1 {
		return fmt.Errorf("%w: invalid version %d", ErrInvalidHeader, h.Version)
	}

	return nil
}

// HasHeader checks if the provided byte slice contains a Cryptdatum header. It looks for specific header
// fields and checks their alignment, but does not perform any further validations. If the data
// is likely to be Cryptdatum, the function returns true. Otherwise, it returns false.
// If you want to verify the integrity of the header as well, use the HasValidHeader function
// or use DecodeHeader and perform the validation yourself.
func HasHeader(data []byte) bool {
	if len(data) < HeaderSize {
		return false
	}
	return magic == [4]byte(data[:4]) && delimiter == [2]byte(data[62:HeaderSize])
}

// HasValidHeader checks if the provided data contains a valid Cryptdatum header. It verifies the
// integrity of the header by checking the magic number, delimiter, and other fields. If the header
// is valid, the function returns true. Otherwise, it returns false.
//
// See Cryptdatum Specification for more details.
func HasValidHeader(data []byte) bool {
	if !HasHeader(data) {
		return false
	}

	if _, err := ParseHeader(data); err != nil {
		return false
	}

	return true
}

// ParseHeader parses the byte slice into a Header struct.
func ParseHeader(data []byte) (h Header, err error) {
	if !HasHeader(data) {
		return h, ErrFormat
	}
	// Parse fields from the byte slice
	h.Flags = DatumFlag(binary.LittleEndian.Uint64(data[4:12]))
	h.Timestamp = binary.LittleEndian.Uint64(data[12:20])
	h.Size = binary.LittleEndian.Uint64(data[20:28])
	h.Version = binary.LittleEndian.Uint16(data[28:30])
	h.ChunkSize = binary.LittleEndian.Uint16(data[30:32])
	h.OperationCounter = binary.LittleEndian.Uint32(data[32:36])
	h.NetworkID = binary.LittleEndian.Uint32(data[36:40])
	h.MetadataSize = binary.LittleEndian.Uint32(data[40:44])
	h.Checksum = binary.LittleEndian.Uint64(data[44:52])
	h.CompressionAlgorithm = binary.LittleEndian.Uint16(data[52:54])
	h.EncryptionAlgorithm = binary.LittleEndian.Uint16(data[54:56])
	h.SignatureType = binary.LittleEndian.Uint16(data[56:58])
	h.SignatureSize = binary.LittleEndian.Uint16(data[58:60])
	h.MetadataSpec = binary.LittleEndian.Uint16(data[60:62])
	return h, h.Validate()
}

type Container struct {
	mu     sync.RWMutex
	header Header
	path   string
	rwc    io.ReadWriteCloser
}

// Open opens the named Cryptdatum file for reading. If successful,
// methods on the returned file can be used for reading; the associated file
// descriptor has mode os.O_RDONLY.
func Open(name string) (*Container, error) {
	file, err := os.OpenFile(name, os.O_RDONLY, 0)
	if err != nil {
		return nil, errors.Join(Error, err)
	}

	datx := &Container{
		path: name,
		rwc:  file,
	}

	// Read the first 64 bytes
	headerbuf := make([]byte, HeaderSize)
	if _, err := file.ReadAt(headerbuf, 0); err != nil {
		if cerr := datx.Close(); cerr != nil {
			return nil, errors.Join(err, cerr)
		}
		return nil, errors.Join(Error, err)
	}

	header, err := ParseHeader(headerbuf)
	if err != nil {
		if cerr := datx.Close(); cerr != nil {
			return nil, errors.Join(cerr, err)
		}
		return nil, errors.Join(Error, err)
	}
	datx.header = header

	return datx, nil
}

// Close closes the File, rendering it unusable for I/O.
// On files that support SetDeadline, any pending I/O operations will
// be canceled and return immediately with an ErrClosed error.
// Close will return an error if it has already been called.
func (c *Container) Close() (err error) {

	if err := c.Sync(); err != nil {
		return err
	}

	c.mu.RLock()
	defer c.mu.RUnlock()
	if c.rwc != nil {
		err = errors.Join(err, c.rwc.Close())
	}

	return err
}

func (c *Container) Info() (Info, error) {
	c.mu.RLock()
	defer c.mu.RUnlock()

	info := Info{
		Header: c.header,
	}
	return info, nil
}

func (c *Container) Seal() (Info, error) {
	c.mu.RLock()
	defer c.mu.RUnlock()

	info := Info{
		Header: c.header,
	}
	return info, nil
}

func (c *Container) SaveTo(path string, overwrite bool) error {
	c.mu.Lock()
	defer c.mu.Unlock()
	if c.path != "" {
		return fmt.Errorf("%w: can not set destination path to %s already set to %s", Error, path, c.path)
	}
	finfo, err := os.Stat(path)
	if err != nil {
		if !errors.Is(err, os.ErrNotExist) {
			return fmt.Errorf("%w: SaveTo %s", Error, err.Error())
		}
	} else {
		if finfo != nil && finfo.IsDir() {
			return fmt.Errorf("%w: provided path to SaveTo is directory", Error)
		} else if !overwrite {
			return fmt.Errorf("%w: file already exists %s", Error, path)
		}

	}

	fp, err := os.OpenFile(path, os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0640)
	if err != nil {
		return fmt.Errorf("%w: failed to create file, %s", Error, err.Error())
	}
	c.rwc = fp
	return nil
}

func (c *Container) Sync() error {
	c.mu.Lock()
	defer c.mu.Unlock()

	if c.rwc == nil {
		return nil
	}

	return nil
}

type Info struct {
	Header Header
}

///////////////////////////////////////////////////////////////////////////////
// Proposed API's
///////////////////////////////////////////////////////////////////////////////
// type Reader struct{}

// func ReadAll(r Reader) ([]byte, error) { return nil, nil }

// type Writer struct{}

func New(name string) *Container {
	return &Container{
		header: Header{
			Flags:     DatumDraft,
			Timestamp: uint64(time.Now().UnixNano()),
			Version:   Version,
		},
	}
}
