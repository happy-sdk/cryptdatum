# 6. Compression

## 6.1 Overview

Compression reduces payload size for storage and transmission efficiency. When the DATUM_COMPRESSED flag is set, the payload is compressed using the algorithm specified in the COMPRESSION_ALGORITHM header field.

## 6.2 Compression Scope

### 6.2.1 What Gets Compressed

Compression applies to:

- **Payload data**:
  - Non-chunked: The entire payload is compressed as a single unit
  - Chunked: Each chunk's data is compressed individually
- **Metadata block**: The metadata content (not the size field) is compressed when DATUM_METADATA is set

Compression does NOT apply to:

- Header (always uncompressed)
- Checksum block
- Signature block
- Metadata size field (remains readable)

### 6.2.2 Processing Order

Compression occurs before encryption:

1. Original data → Compress → Encrypt → Store
2. Stored data → Decrypt → Decompress → Original data

This applies to both payload and metadata blocks. The order ensures encryption algorithms work with compressed data's higher entropy.

## 6.3 Algorithm Requirements

Compression algorithms used with Cryptdatum MUST:

1. **Deterministic**: Same input always produces same output
2. **Self-contained**: Compressed data must be decompressible without external dictionaries
3. **Streamable**: Support streaming compression/decompression for large data
4. **Bounded**: Define maximum expansion ratio (for incompressible data)

## 6.4 Chunked Compression

When both DATUM_COMPRESSED and DATUM_CHUNKED flags are set:

1. Each chunk is compressed independently
2. Chunk size (in header) refers to compressed size
3. Enables parallel compression/decompression
4. Allows random access to chunks without decompressing entire payload

Chunk structure with compression:

```bnf
<chunk_id:8> <chunk_size:8> <compressed_data> <encryption_metadata>? <chunk_checksum>?
```

Where `chunk_size` = compressed data size in bytes.

## 6.5 Compression Levels

Some algorithms support compression levels. The algorithm specification defines:

- Whether levels are supported
- How to specify the level (if not in COMPRESSION_ALGORITHM value)
- Default level if not specified

## 6.6 Implementation Considerations

### 6.6.1 Memory Requirements

- Non-chunked compression may require significant memory
- Chunked compression limits memory to maximum chunk size
- Implementations SHOULD use streaming APIs when available

### 6.6.2 CPU vs Size Tradeoffs

- Higher compression ratios typically require more CPU time
- Consider use case: archival (max compression) vs real-time (fast compression)
- Some algorithms offer presets balancing speed and ratio

### 6.6.3 Incompressible Data

- Compressed size may exceed original size for already-compressed data
- Implementations SHOULD detect this and store uncompressed with DATUM_COMPRESSED unset
- Maximum expansion is algorithm-specific (typically < 1% + small constant)

## 6.7 Error Handling

Decompression failures MUST be treated as fatal errors:

- Set DATUM_INVALID flag if keeping corrupted container
- Report specific error (corrupted stream, invalid header, etc.)
- Do not return partial decompressed data

## 6.8 Algorithm Selection Guidelines

Choose compression algorithms based on:

| Use Case | Recommended Properties |
|----------|----------------------|
| Archival | Maximum ratio, slower acceptable |
| Network transfer | Balanced ratio/speed |
| Real-time | Fast compression, moderate ratio |
| Text/JSON | Algorithms optimized for text |
| Binary/Media | Algorithms handling high entropy |

## 6.9 Security Considerations

- Compression before encryption is standard practice
- Do not compress after encryption (ruins entropy)
- Be aware of compression oracle attacks in interactive protocols
- Some algorithms include integrity checks (complementing checksums)
