# 2. Format Structure

## 2.1 Overview

The Cryptdatum format consists of structured binary data organized in blocks. All multi-byte numeric values use little-endian byte order. Signed integers use two's complement representation.

### 2.1.1 Container Structure

A valid Cryptdatum container follows this structure:

```bnf
<cryptdatum> ::= <header> <data_section>

<data_section> ::= <checksum_block>? <metadata_block>? <signature_block>? <payload>
                 | <checksum_block>? <metadata_block>? <payload>
                 | <checksum_block>? <signature_block>? <payload>
                 | <checksum_block>? <payload>
                 | <payload>
```

The presence of optional blocks is determined by flags in the header. When present, blocks MUST appear in the order shown.

## 2.2 Header Structure

The header is a fixed 128-byte structure at the beginning of every Cryptdatum container.

### 2.2.1 Header Layout

| Offset | Field | Type | Size | Description |
|--------|-------|------|------|-------------|
| 0 | MAGIC | byte[4] | 4 | Magic bytes: `0xA7, 0xF6, 0xE5, 0xD4` |
| 4 | VERSION | uint16[3] | 6 | Semantic version (major, minor, patch) |
| 10 | TIMESTAMP | uint64 | 8 | Unix timestamp in nanoseconds |
| 18 | FLAGS | uint64 | 8 | Feature flags bitmask |
| 26 | SIZE | uint128 | 16 | Total payload size (lo 8 bytes, hi 8 bytes) |
| 42 | CHECKSUM_ALGORITHM | uint32 | 4 | Checksum algorithm identifier |
| 46 | COMPRESSION_ALGORITHM | uint32 | 4 | Compression algorithm identifier |
| 50 | ENCRYPTION_ALGORITHM | uint32 | 4 | Encryption algorithm identifier |
| 54 | SIGNATURE_ALGORITHM | uint32 | 4 | Signature algorithm identifier |
| 58 | METADATA_SPEC | uint64 | 8 | Metadata schema identifier |
| 66 | NETWORK_ID | uint64 | 8 | Network identifier |
| 74 | OPC | uint32 | 4 | Operation counter |
| 78 | RESERVED | byte[24] | 24 | Reserved for future use (must be zero) |
| 102 | CUSTOM | byte[24] | 24 | User-defined data |
| 126 | DELIMITER | byte[2] | 2 | End delimiter: `0xA6, 0xE5` |

Total size: 128 bytes

### 2.2.2 Header Field Requirements

- MAGIC and DELIMITER fields are REQUIRED and MUST contain the specified values
- VERSION field is REQUIRED; major version MUST NOT be zero
- TIMESTAMP field is REQUIRED and MUST be greater than 1652155382000000001
- FLAGS field is REQUIRED; minimum valid value is 1
- All other fields MUST be zero when not in use

## 2.3 Block Structures

### 2.3.1 Checksum Block

When the DATUM_CHECKSUM flag is set:

```bnf
<checksum_block> ::= <checksum_size> <meta_checksum>
```

The checksum block contains:

- `checksum_size`: Size field per algorithm specification
- `meta_checksum`: Single checksum calculated over header bytes and all component checksum values

Individual component checksums are stored with their respective data, not in this block.

See Section 5 (Checksums) for detailed coverage and calculation methods.

### 2.3.2 Metadata Block

When the DATUM_METADATA flag is set:

```bnf
<metadata_block> ::= <metadata_size:4> <metadata_content> <metadata_checksum>
```

Where:

- `<metadata_size:4>`: uint32 - total size including this field
- `<metadata_content>`: metadata encoded per METADATA_SPEC (may be compressed and/or encrypted)
- `<metadata_checksum>`: checksum per CHECKSUM_ALGORITHM specification

When DATUM_COMPRESSED is set, `metadata_content` is compressed.
When DATUM_ENCRYPTED is set, `metadata_content` is encrypted (after compression if both flags are set).

### 2.3.3 Signature Block

When the DATUM_SIGNED flag is set:

```bnf
<signature_block> ::= <signature_data>
```

The signature algorithm specified in SIGNATURE_ALGORITHM defines:

- The size field width (uint8, uint16, uint32, etc.)
- The internal structure of signature_data
- Whether and how an integrity checksum is included

If signature is external, the algorithm specification defines how this is indicated.

See Section 10 (Algorithm Registry) for algorithm-specific signature block formats.

## 2.4 Payload Structure

### 2.4.1 Non-Chunked Payload

When DATUM_CHUNKED flag is not set:

```bnf
<payload> ::= <data> <payload_checksum>?
```

Where:

- `<data>`: The payload data (may be compressed and/or encrypted)
- `<payload_checksum>`: Present when DATUM_CHECKSUM is set, size per CHECKSUM_ALGORITHM

### 2.4.2 Chunked Payload

When DATUM_CHUNKED flag is set:

```bnf
<payload> ::= <chunk>+

<chunk> ::= <chunk_id:8> <chunk_size:8> <chunk_data> <encryption_metadata>? <chunk_checksum>?
```

Where:

- `<chunk_id:8>`: uint64 - sequential ID starting from 0
- `<chunk_size:8>`: uint64 - exact size in bytes
- `<chunk_data>`: the chunk's data
- `<encryption_metadata>`: optional, algorithm-specific
- `<chunk_checksum>`: present if DATUM_CHECKSUM or DATUM_SIGNED is set, size per CHECKSUM_ALGORITHM

#### Encryption Metadata in Chunks

When DATUM_ENCRYPTED is set, chunks may include algorithm-specific metadata. The encryption algorithm defines whether this metadata exists and its format. Implementations MUST consult the algorithm specification.

## 2.5 Constants

### 2.5.1 Magic Values

| Name | Value | Description |
|------|-------|-------------|
| MAGIC_PREFIX | `0xA7F6E5D4` | Header start marker |
| DELIMITER | `0xA6E5` | Header end marker |
| MAGIC_DATE | `1652155382000000001` | Minimum valid timestamp |

### 2.5.2 Size Limits

- Maximum chunk count: 2^64 chunks
- Maximum chunk size: 2^64 bytes (16 EiB)
- Maximum payload size (uint64 mode): 2^64 bytes
- Maximum payload size (uint128 mode): 2^128 bytes

## 2.6 Processing Order

### 2.6.1 Encoding Order

1. Compress payload and metadata (if DATUM_COMPRESSED)
2. Encrypt payload and metadata (if DATUM_ENCRYPTED)
3. Calculate checksums and meta-checksum (if DATUM_CHECKSUM)
4. Generate signature over meta-checksum (if DATUM_SIGNED)

### 2.6.2 Decoding Order

1. Verify signature over meta-checksum (if DATUM_SIGNED and verification desired)
2. Verify checksums including meta-checksum (if DATUM_CHECKSUM)
3. Decrypt payload and metadata (if DATUM_ENCRYPTED)
4. Decompress payload and metadata (if DATUM_COMPRESSED)

Note: Signature verification MAY be skipped if the implementation only needs to access the data without verifying authenticity.
