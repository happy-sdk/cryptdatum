# 3. Feature Flags

## 3.1 Overview

Feature flags are stored in the FLAGS field (8 bytes) of the header as a bitmask. Each bit indicates whether a specific feature is enabled in the container. Flags ensure backward compatibility - implementations MUST ignore unknown flags.

## 3.2 Flag Registry

| Bit | Hex Value | Name | Description |
|-----|-----------|------|-------------|
| 0 | 0x0001 | DATUM_INVALID | Container structure is valid but data is marked invalid |
| 1 | 0x0002 | DATUM_DRAFT | Container is in draft state; values are not final |
| 2 | 0x0004 | DATUM_EMPTY | Container has no payload |
| 3 | 0x0008 | DATUM_CHECKSUM | Checksums are calculated and present |
| 4 | 0x0010 | DATUM_OPC | Operation counter is set in header |
| 5 | 0x0020 | DATUM_COMPRESSED | Payload is compressed using COMPRESSION_ALGORITHM |
| 6 | 0x0040 | DATUM_ENCRYPTED | Payload is encrypted using ENCRYPTION_ALGORITHM |
| 7 | 0x0080 | DATUM_EXTRACTABLE | Payload can be processed by external programs |
| 8 | 0x0100 | DATUM_SIGNED | Container is digitally signed |
| 9 | 0x0200 | DATUM_CHUNKED | Payload is divided into chunks |
| 10 | 0x0400 | DATUM_METADATA | Metadata block is present |
| 11 | 0x0800 | DATUM_COMPROMISED | Data integrity cannot be guaranteed |
| 12 | 0x1000 | DATUM_NETWORK | Network ID is set in header |
| 13-63 | - | Reserved | Reserved for future use |

## 3.3 Flag Definitions

### 3.3.1 DATUM_INVALID (bit 0)

Indicates the container structure is valid but the data should not be trusted. This flag MAY be set when validation fails but the container remains readable.

### 3.3.2 DATUM_DRAFT (bit 1)

Indicates the container contains preliminary data that may change. Implementations SHOULD NOT rely on draft data for production use.

### 3.3.3 DATUM_EMPTY (bit 2)

Indicates the container has no payload. When set:

- The SIZE field MUST be zero
- No payload block is present
- Other blocks (checksum, metadata, signature) MAY still be present

### 3.3.4 DATUM_CHECKSUM (bit 3)

Indicates checksums are calculated for data integrity. When set:

- CHECKSUM_ALGORITHM field MUST specify the algorithm
- Checksum block MUST be present after the header
- For chunked data, each chunk includes a checksum

### 3.3.5 DATUM_OPC (bit 4)

Indicates the operation counter is used. When set:

- OPC field MUST be greater than zero
- Used to differentiate multiple operations with the same timestamp

### 3.3.6 DATUM_COMPRESSED (bit 5)

Indicates the payload is compressed. When set:

- COMPRESSION_ALGORITHM field MUST specify the algorithm
- Compression is applied before encryption

### 3.3.7 DATUM_ENCRYPTED (bit 6)

Indicates the payload is encrypted. When set:

- ENCRYPTION_ALGORITHM field MUST specify the algorithm
- Encryption is applied after compression

### 3.3.8 DATUM_EXTRACTABLE (bit 7)

Indicates the payload is a standalone file that can be extracted and processed independently. When set:

- Metadata SHOULD include file information (name, permissions, etc.)
- The payload retains its original format

### 3.3.9 DATUM_SIGNED (bit 8)

Indicates the container has a digital signature. When set:

- SIGNATURE_ALGORITHM field MUST specify the algorithm
- Signature block MUST be present (may contain external reference)
- DATUM_CHECKSUM MUST also be set

### 3.3.10 DATUM_CHUNKED (bit 9)

Indicates the payload is divided into chunks. When set:

- Payload consists of one or more chunks
- Each chunk has an ID, size, and optional checksum
- Enables streaming and parallel processing

### 3.3.11 DATUM_METADATA (bit 10)

Indicates metadata is present. When set:

- METADATA_SPEC field MUST specify the schema
- Metadata block MUST be present after checksum block (if any)

### 3.3.12 DATUM_COMPROMISED (bit 11)

Indicates the data may have been tampered with or corrupted. When set:

- Implementations MUST NOT process the payload without explicit user confirmation
- This flag takes precedence over DATUM_INVALID

### 3.3.13 DATUM_NETWORK (bit 12)

Indicates the container includes network identification. When set:

- NETWORK_ID field MUST be greater than zero
- Used for multi-network or distributed systems

## 3.4 Flag Combinations

Some flags have dependencies or mutual exclusions:

- DATUM_SIGNED requires DATUM_CHECKSUM
- DATUM_EMPTY excludes DATUM_COMPRESSED, DATUM_ENCRYPTED, and DATUM_CHUNKED
- DATUM_COMPROMISED overrides DATUM_INVALID

## 3.5 Implementation Requirements

- Implementations MUST recognize all defined flags
- Implementations MUST ignore undefined flag bits (for forward compatibility)
- Implementations MUST reject containers where required fields for set flags are missing
