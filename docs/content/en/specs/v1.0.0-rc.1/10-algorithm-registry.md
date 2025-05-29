# 10. Algorithm Registry

## 10.1 Overview

This registry defines algorithm identifiers and their associated data structures for use in Cryptdatum containers. Each algorithm category uses a 32-bit identifier space with reserved ranges for standard and custom algorithms.

## 10.2 Registry Structure

### 10.2.1 Identifier Ranges

| Range | Usage |
|-------|-------|
| 0x00000000 | NULL/None algorithm |
| 0x00000001 - 0x0000FFFF | Standard algorithms |
| 0x00010000 - 0x7FFFFFFF | Reserved for future use |
| 0x80000000 - 0xFFFFFFFF | Custom/private algorithms |

### 10.2.2 Algorithm Categories

1. **Checksum Algorithms** (CHECKSUM_ALGORITHM field)
2. **Compression Algorithms** (COMPRESSION_ALGORITHM field)
3. **Encryption Algorithms** (ENCRYPTION_ALGORITHM field)
4. **Signature Algorithms** (SIGNATURE_ALGORITHM field)

## 10.3 Checksum Algorithms

### 10.3.1 Registry

| ID | Name | Description |
|----|------|-------------|
| 0x00000000 | NULL | No checksum |
| 0x00000001 | CRC32 | CRC-32 (IEEE 802.3) |
| 0x00000002 | CRC64 | CRC-64 (ISO 3309) |
| 0x00000003 | SHA256 | SHA-256 hash |
| 0x00000004 | SHA512 | SHA-512 hash |
| 0x00000005 | SHA3_256 | SHA3-256 hash |
| 0x00000006 | SHA3_512 | SHA3-512 hash |
| 0x00000007 | BLAKE2B | BLAKE2b hash (64 bytes) |
| 0x00000008 | BLAKE2S | BLAKE2s hash (32 bytes) |
| 0x00000009 | BLAKE3 | BLAKE3 hash |
| 0x0000000A | XXHASH64 | xxHash 64-bit |
| 0x0000000B | XXHASH3 | xxHash3 128-bit |
| 0x0000000C | POLY1305 | Poly1305 MAC (requires key) |

### 10.3.2 Checksum Block Structures

Each algorithm defines its checksum block structure:

**CRC32 (0x00000001)**

```bnf
<size:2> <meta_checksum:4>
```

- size: uint16 = 6
- meta_checksum: 4-byte CRC32 value

**SHA256 (0x00000003)**

```bnf
<size:2> <meta_checksum:32>
```

- size: uint16 = 34
- meta_checksum: 32-byte SHA256 hash

**CRC64 (0x00000002)**

```bnf
<size:2> <meta_checksum:8>
```

- size: uint16 = 10
- meta_checksum: 8-byte CRC64 value

## 10.4 Compression Algorithms

### 10.4.1 Registry

| ID | Name | Description |
|----|------|-------------|
| 0x00000000 | NULL | No compression |
| 0x00000001 | ZLIB | DEFLATE with zlib wrapper |
| 0x00000002 | GZIP | DEFLATE with gzip wrapper |
| 0x00000003 | BZIP2 | Bzip2 compression |
| 0x00000004 | LZMA | LZMA compression |
| 0x00000005 | XZ | XZ format (LZMA2) |
| 0x00000006 | LZ4 | LZ4 compression |
| 0x00000007 | ZSTD | Zstandard compression |
| 0x00000008 | BROTLI | Brotli compression |
| 0x00000009 | SNAPPY | Snappy compression |

### 10.4.2 Compression Parameters

Some algorithms encode parameters in the ID:

- ZSTD levels: 0x00000700 + level (e.g., 0x00000703 for level 3)
- Custom dictionaries: Use custom ID range

## 10.5 Encryption Algorithms

### 10.5.1 Registry

| ID | Name | Description |
|----|------|-------------|
| 0x00000000 | NULL | No encryption |
| 0x00000001 | AES128_GCM | AES-128 in GCM mode |
| 0x00000002 | AES256_GCM | AES-256 in GCM mode |
| 0x00000003 | AES128_CTR | AES-128 in CTR mode |
| 0x00000004 | AES256_CTR | AES-256 in CTR mode |
| 0x00000005 | CHACHA20_POLY1305 | ChaCha20-Poly1305 AEAD |
| 0x00000006 | XCHACHA20_POLY1305 | XChaCha20-Poly1305 AEAD |
| 0x00000007 | AES128_OCB3 | AES-128 OCB3 mode |
| 0x00000008 | AES256_OCB3 | AES-256 OCB3 mode |

### 10.5.2 Encryption Metadata Structures

**AES256_GCM (0x00000002)**

For non-chunked:

```bnf
<nonce:12> <auth_tag:16>
```

For each chunk:

```bnf
<chunk_data> <nonce:12> <auth_tag:16> <checksum>?
```

**CHACHA20_POLY1305 (0x00000005)**

```bnf
<chunk_data> <nonce:12> <auth_tag:16> <checksum>?
```

## 10.6 Signature Algorithms

### 10.6.1 Registry

| ID | Name | Description |
|----|------|-------------|
| 0x00000000 | NULL | No signature |
| 0x00000001 | ED25519 | Ed25519 signature |
| 0x00000002 | ED448 | Ed448 signature |
| 0x00000003 | ECDSA_P256 | ECDSA with P-256 curve |
| 0x00000004 | ECDSA_P384 | ECDSA with P-384 curve |
| 0x00000005 | ECDSA_P521 | ECDSA with P-521 curve |
| 0x00000006 | RSA_PSS_2048 | RSA-PSS with 2048-bit key |
| 0x00000007 | RSA_PSS_3072 | RSA-PSS with 3072-bit key |
| 0x00000008 | RSA_PSS_4096 | RSA-PSS with 4096-bit key |
| 0x00000009 | EXTERNAL | External signature |

### 10.6.2 Signature Block Structures

**ED25519 (0x00000001)**

```bnf
<size:2> <signature:64> <public_key:32>?
```

- size: uint16 (66 or 98 with public key)
- signature: 64-byte Ed25519 signature
- public_key: Optional 32-byte public key

**RSA_PSS_2048 (0x00000006)**

```bnf
<size:4> <signature:256> <key_id:8>
```

- size: uint32 = 268
- signature: 256-byte RSA signature
- key_id: 8-byte key identifier

**EXTERNAL (0x00000009)**

```bnf
<size:2> <reference_length:2> <reference>
```

- size: uint16
- reference: External signature location (URL, hash, etc.)

## 10.7 Custom Algorithms

### 10.7.1 Custom ID Range

Custom algorithm identifiers MUST use the range:

```text
0x80000000 - 0xFFFFFFFF
```

This provides 2,147,483,648 unique identifiers for private use. Organizations and developers are free to allocate identifiers within this range as needed.

### 10.7.2 Custom Algorithm Requirements

Custom algorithms MUST:

1. Document their data structures
2. Specify size field format
3. Define error conditions
4. Provide reference implementation

## 10.8 Algorithm Selection Guidelines

### 10.8.1 Security Levels

| Security Level | Checksum | Encryption | Signature |
|----------------|----------|------------|-----------|
| Legacy | CRC32 | - | - |
| Standard | SHA256 | AES128_GCM | ECDSA_P256 |
| High | SHA512 | AES256_GCM | ECDSA_P384 |
| Quantum-Resistant | SHA3_512 | (future) | (future) |

### 10.8.2 Performance Priorities

| Priority | Checksum | Compression | Encryption |
|----------|----------|-------------|------------|
| Speed | XXHASH3 | LZ4 | CHACHA20_POLY1305 |
| Size | CRC32 | ZSTD | AES128_GCM |
| Balance | BLAKE2B | ZLIB | AES256_GCM |

## 10.9 Implementation Notes

- Implementations SHOULD maintain an up-to-date registry of algorithm identifiers
- Implementations MAY support a subset of algorithms based on their requirements and platform capabilities
- When encountering an unsupported algorithm, implementations MUST:
  - Clearly indicate to the user which algorithm is not supported
  - Provide guidance if the algorithm can be supported through external dependencies
  - Handle the error gracefully without compromising security
- NULL algorithms (ID = 0) indicate feature is disabled
- Unknown algorithms MUST result in parsing errors
- Implementations SHOULD document which algorithms they support and any external dependencies required
