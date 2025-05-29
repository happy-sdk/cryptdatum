# 4. Metadata

## 4.1 Overview

Metadata provides structured information about the container and its payload. When the DATUM_METADATA flag is set, a metadata block appears after the checksum block (if present) and before the signature block (if present).

## 4.2 Metadata Block Structure

The metadata block follows this structure:

```bnf
<metadata_size:4> <metadata_content> <metadata_checksum>
```

Where:

- `metadata_size` (uint32): Total size of the metadata block including this field
- `metadata_content`: Schema-specific metadata content (may be compressed and/or encrypted)
- `metadata_checksum`: Checksum calculated per CHECKSUM_ALGORITHM

The checksum covers the entire metadata block including the size field.

When DATUM_COMPRESSED is set, `metadata_content` is compressed before storage.
When DATUM_ENCRYPTED is set, `metadata_content` is encrypted (after compression if both flags are set).
The size field always reflects the final size after compression/encryption.

## 4.3 Schema Specifications

The METADATA_SPEC field in the header identifies the metadata schema using a 64-bit identifier.

### 4.3.1 Standard Schemas

| ID | Name | Description |
|----|------|-------------|
| 0x0000000000000000 | NULL | No schema (raw bytes) |
| 0x0000000000000001 | JSON | UTF-8 encoded JSON |
| 0x0000000000000002 | CBOR | Concise Binary Object Representation |
| 0x0000000000000003 | MessagePack | MessagePack binary format |
| 0x0000000000000004 | Protocol Buffers | Google Protocol Buffers |
| 0x0000000000000010 | File Info | Standard file metadata (see 4.4.1) |
| 0x0000000000000011 | Archive | Archive metadata (see 4.4.2) |
| 0x0000000000000012 | Stream | Streaming metadata (see 4.4.3) |

### 4.3.2 Custom Schemas

Custom schema identifiers MUST use values >= 0x0000000100000000. Organizations MAY define their own schemas by:

1. Selecting an identifier in the custom range
2. Publishing the schema specification
3. Ensuring the schema is versioned independently

## 4.4 Predefined Metadata Structures

### 4.4.1 File Info Schema (0x10)

Used when DATUM_EXTRACTABLE is set. Binary structure:

| Offset | Field | Type | Size | Description |
|--------|-------|------|------|-------------|
| 0 | version | uint16 | 2 | Schema version (currently 1) |
| 2 | mode | uint32 | 4 | Unix file permissions |
| 6 | mtime | uint64 | 8 | Modification time (Unix nanoseconds) |
| 14 | attributes | uint32 | 4 | Platform-specific attributes |
| 18 | raw_size | uint64 | 8 | Uncompressed/decrypted file size in bytes |
| 26 | name_length | uint16 | 2 | Filename length in bytes |
| 28 | name | bytes | varies | UTF-8 encoded filename |

The raw_size field allows implementations to pre-allocate buffers before decompression/decryption.

### 4.4.2 Archive Schema (0x11)

For multi-file archives. Binary structure:

| Offset | Field | Type | Size | Description |
|--------|-------|------|------|-------------|
| 0 | version | uint16 | 2 | Schema version (currently 1) |
| 2 | entry_count | uint32 | 4 | Number of archive entries |
| 6 | entries | array | varies | Array of archive entries |

Each archive entry contains:

| Offset | Field | Type | Size | Description |
|--------|-------|------|------|-------------|
| 0 | mode | uint32 | 4 | Unix file permissions |
| 4 | mtime | uint64 | 8 | Modification time (Unix nanoseconds) |
| 12 | attributes | uint32 | 4 | Platform-specific attributes |
| 16 | raw_size | uint64 | 8 | Uncompressed/decrypted file size in bytes |
| 24 | start_offset | uint64 | 8 | Offset in payload where file starts |
| 32 | size | uint64 | 8 | Size of file in bytes (compressed/encrypted) |
| 40 | name_length | uint16 | 2 | Filename length in bytes |
| 42 | name | bytes | varies | UTF-8 encoded filename |

This structure allows direct access to any file within the archive by reading its start_offset and size from the metadata. The raw_size field enables proper buffer allocation before decompression.

Note: When DATUM_CHUNKED is set, byte-level chunk sizes allow exact file extraction without padding overhead.

### 4.4.3 Stream Schema (0x12)

For streaming data. Binary structure:

| Offset | Field | Type | Size | Description |
|--------|-------|------|------|-------------|
| 0 | version | uint16 | 2 | Schema version (currently 1) |
| 2 | stream_id | uint64 | 8 | Unique stream identifier |
| 10 | sequence | uint64 | 8 | Sequence number |
| 18 | fragment_size | uint32 | 4 | Expected fragment size |
| 22 | total_fragments | uint32 | 4 | Total fragments (0 if unknown) |
| 26 | flags | uint16 | 2 | Stream-specific flags |

## 4.5 Metadata Content Requirements

### 4.5.1 Size Limits

- Maximum metadata size: 4,294,967,295 bytes (~4 GiB) as limited by uint32 size field
- Implementations SHOULD warn when metadata exceeds 3 GiB
- Implementations MAY reject metadata larger than 1 GiB for performance reasons
- Metadata MUST NOT contain the actual payload data

### 4.5.2 Encoding Requirements

For text-based schemas (JSON, XML):

- MUST use UTF-8 encoding
- MUST NOT include byte order marks (BOM)
- SHOULD use compact representation

For binary schemas:

- MUST follow the schema's canonical encoding
- MUST include version information

### 4.5.3 Security Considerations

- Metadata MUST be validated against the specified schema
- Implementations MUST NOT execute code from metadata
- User input in metadata MUST be sanitized
- Size limits MUST be enforced before parsing

## 4.6 Extensibility

Metadata schemas are designed for extensibility:

1. **Schema Versioning**: Each schema includes a version field
2. **Forward Compatibility**: Unknown fields MUST be preserved
3. **Backward Compatibility**: New versions MUST support reading older versions
4. **Schema Negotiation**: Implementations MAY support multiple schema versions

## 4.7 Implementation Notes

- Metadata parsing failures SHOULD NOT prevent payload access
- When DATUM_SIGNED is set, metadata is included in the signature
- Implementations SHOULD cache parsed metadata for performance
- Custom schemas SHOULD be documented publicly for interoperability
