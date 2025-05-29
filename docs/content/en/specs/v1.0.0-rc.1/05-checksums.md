# 5. Checksums

## 5.1 Overview

Checksums provide data integrity verification for Cryptdatum containers. When the DATUM_CHECKSUM flag is set, checksums are calculated for each component and a meta-checksum is stored in the checksum block. The algorithm specified in CHECKSUM_ALGORITHM determines checksum sizes and formats.

## 5.2 Checksum Architecture

### 5.2.1 Component Checksums

Checksums are calculated for each component, but stored in different locations:

- **Header**: Checksum calculated over bytes 0-65, 78-127 (not stored, used in meta-checksum)
- **Metadata**: Checksum appended to metadata block after content
- **Payload**:
  - Non-chunked: Checksum appended at end of payload
  - Chunked: Individual chunk checksums in payload, final superblock checksum used in meta-checksum
- **Signature**: Checksum location defined by signature algorithm (independent, not in meta-checksum)

Header, metadata, and payload checksum values are concatenated as input to the meta-checksum calculation.

### 5.2.2 Meta-Checksum

The checksum block contains only a meta-checksum value:

```bnf
<checksum_block> ::= <checksum_size> <meta_checksum>
```

Where:

- `checksum_size`: Algorithm-specific size field (e.g., uint16, uint32)
- `meta_checksum`: Single checksum value calculated over concatenated bytes of:
  - Header bytes used for checksum (0-65, 78-127)
  - Metadata checksum value (if DATUM_METADATA is set)
  - Payload checksum value:
    - Non-chunked: Read from end of payload
    - Chunked: The final superblock checksum

Individual component checksums are NOT stored in the checksum block - they are either:

- Calculated during processing (header)
- Appended to their respective data (metadata, payload)
- Part of the hierarchical tree (chunks)

Note: Signature checksums are independent and used only to verify the signature block itself.

## 5.3 Checksum Coverage

### 5.3.1 Standard Coverage Areas

| Component | Coverage | When Present |
|-----------|----------|--------------|
| Header | Bytes 0-65, 78-127 (includes delimiter, excludes NETWORK_ID/OPC) | Always |
| Metadata | Entire metadata block including size field | When DATUM_METADATA is set |
| Payload | See 5.3.2 and 5.4 | Always (unless DATUM_EMPTY) |
| Signature | Entire signature block (independent checksum) | When DATUM_SIGNED is set |

Note: NETWORK_ID (bytes 66-73) and OPC (bytes 74-77) are excluded to allow modification without invalidating checksums.

### 5.3.2 Payload Checksum Coverage

- **Non-chunked**: Checksum covers entire payload after compression/encryption. The checksum is appended at the end of the payload (not in the checksum block)
- **Chunked**: Hierarchical checksum tree with final checksum in checksum block (see 5.4)
- **Empty**: No payload checksum when DATUM_EMPTY is set

## 5.4 Hierarchical Checksums for Chunked Data

When DATUM_CHUNKED is set, checksums form a hierarchical tree structure for efficient verification of large datasets.

### 5.4.1 Chunk-Level Checksums

Each chunk includes its own checksum:

```bnf
<chunk> ::= <chunk_id:8> <chunk_size:8> <chunk_data> <encryption_metadata>? <chunk_checksum>
```

The chunk checksum covers chunk_id + chunk_size + chunk_data + encryption_metadata (if present).

### 5.4.2 Hierarchical Structure

Checksums are organized in a hierarchical, parallel-friendly manner using fixed-size groups of 65,536 at each level.

1. **Chunk Hashes**: Each chunk's data (ID + size + data + encryption metadata) is hashed
2. **Chunk Blocks**: Group up to 65,536 chunk hashes, then hash the group
3. **Chunk Digest Blocks**: Group up to 65,536 chunk block hashes, then hash the group
4. **Chunk Block Clusters**: Group up to 65,536 digest block hashes, then hash the group
5. **Chunk Super Block**: Group up to 65,536 cluster hashes, then hash the group
6. **Payload Checksum**: Final hash of the super block

**Visual Processing Workflow:**

```text
[chunk_data]
   |
   v
[chunk_hash]
   |
   v  (max 65,536 entries)
[chunk_block]
   |
   v  (checksum algorithm)
[chunk_block_hash]
   |
   v  (max 65,536 entries)
[chunk_digest_block]
   |
   v  (checksum algorithm)
[chunk_digest_block_hash]
   |
   v  (max 65,536 entries)
[chunk_block_cluster]
   |
   v  (checksum algorithm)
[chunk_block_cluster_hash]
   |
   v  (max 65,536 entries)
[chunk_super_block]
   |
   v  (checksum algorithm)
[payload_checksum]
```

**Key Properties:**

- **Parallelism**: All blocks at the same level can be processed independently
- **Memory Efficiency**: At each level, only a single block (max 512 KiB, since 65,536 × 8 bytes for 64-bit checksums) needs to be held in memory
- **Scalability**: This structure supports the full 2^64 chunk ID space with only 5 levels
- **Incremental Verification**: Can verify any chunk by following its path up the tree

### 5.4.3 Hierarchical Benefits

- **Parallel Processing**: Blocks at same level can be processed independently
- **Memory Efficiency**: Only one block per level in memory (max 512 KiB per block)
- **Partial Verification**: Can verify specific chunks without full dataset
- **Scalability**: Supports up to 2^64 chunks with only 5 levels

## 5.5 Checksum Calculation Order

### 5.5.1 Encoding (Writing)

For non-chunked data:

1. Calculate and append payload checksum to payload
2. Calculate metadata checksum (if present) and append to metadata block
3. Calculate meta-checksum over:
   - Header bytes (0-65, 78-127)
   - Metadata checksum value
   - Payload checksum value (from end of payload)
4. Write checksum block containing only size and meta-checksum
5. Calculate signature (if signing) which covers the meta-checksum

For chunked data:

1. Calculate chunk checksums as chunks are written
2. Build hierarchical checksum tree up to final superblock checksum
3. Calculate metadata checksum (if present) and append to metadata block
4. Calculate meta-checksum over:
   - Header bytes (0-65, 78-127)
   - Metadata checksum value
   - Superblock checksum value
5. Write checksum block containing only size and meta-checksum
6. Calculate signature (if signing) which covers the meta-checksum

### 5.5.2 Decoding (Reading)

For non-chunked data:

1. Read checksum block to get meta-checksum
2. Read entire payload and extract checksum from end
3. Calculate metadata checksum from metadata block (if present)
4. Calculate expected meta-checksum over:
   - Header bytes (0-65, 78-127)
   - Metadata checksum value
   - Payload checksum value
5. Verify meta-checksum matches
6. Verify individual component checksums
7. Verify signature (if present) which should cover the verified meta-checksum

For chunked data:

1. Read checksum block to get meta-checksum
2. Read hierarchical checksum tree to get superblock checksum
3. Calculate metadata checksum from metadata block (if present)
4. Calculate expected meta-checksum over:
   - Header bytes (0-65, 78-127)
   - Metadata checksum value
   - Superblock checksum value
5. Verify meta-checksum matches
6. Verify chunks against hierarchical tree as they are read
7. Verify signature (if present) which should cover the verified meta-checksum

## 5.6 Verification Process

### 5.6.1 Full Verification

1. Read header and checksum block
2. Extract meta-checksum from checksum block
3. Read data sections to obtain component checksums:
   - Metadata checksum from end of metadata block (if present)
   - Payload checksum from end of payload (non-chunked) or hierarchical tree (chunked)
4. Calculate expected meta-checksum over:
   - Header bytes (0-65, 78-127)
   - All component checksum values (metadata and payload)
5. Verify meta-checksum matches stored value
6. Verify each component by recalculating its checksum from data
7. If DATUM_SIGNED is set, verify signature separately (signature verification uses the meta-checksum)

### 5.6.2 Partial Verification

For chunked data only:

- Individual chunks can be verified using their checksums in the hierarchical tree
- Branch verification: verify path from specific chunk up to superblock
- Enables streaming verification and targeted error recovery

Note: Full meta-checksum verification is not possible without reading all components.

### 5.6.3 Error Handling

On checksum failure:

- Report which component or chunk failed
- For chunks, enable targeted retransmission
- Set DATUM_INVALID flag if keeping corrupted container
- Never return unverified data without explicit consent

## 5.7 Algorithm Requirements

Checksum algorithms MUST:

1. Be deterministic (same input → same output)
2. Support streaming/incremental calculation
3. Define exact size and format of checksums
4. Specify meta-checksum calculation method

## 5.8 Security Considerations

- Checksums detect corruption, not deliberate tampering
- For tamper detection, use DATUM_SIGNED
- Some algorithms provide authentication (e.g., Poly1305)
- Always verify checksums before processing untrusted data
- Meta-checksum prevents checksum substitution attacks
