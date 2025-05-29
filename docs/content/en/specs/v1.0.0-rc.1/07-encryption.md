# 7. Encryption

## 7.1 Overview

Encryption provides confidentiality for container data. When the DATUM_ENCRYPTED flag is set, data is encrypted using the algorithm specified in the ENCRYPTION_ALGORITHM header field.

## 7.2 Encryption Scope

### 7.2.1 What Gets Encrypted

Encryption applies to:

- **Payload data**:
  - Non-chunked: The entire payload is encrypted as a single unit
  - Chunked: Each chunk's data is encrypted individually
- **Metadata content**: The metadata content (not the size field) is encrypted when DATUM_METADATA is set

Encryption does NOT apply to:

- Header (always plaintext for accessibility)
- Checksum block
- Signature block
- Metadata size field
- Chunk headers (ID and size fields)

### 7.2.2 Processing Order

Encryption occurs after compression:

1. Original data → Compress → Encrypt → Store
2. Stored data → Decrypt → Decompress → Original data

This order maximizes compression efficiency since encrypted data has high entropy.

## 7.3 Algorithm Requirements

Encryption algorithms used with Cryptdatum MUST:

1. **Authenticated**: Provide authenticated encryption (AEAD) or be paired with signatures
2. **Streamable**: Support streaming encryption/decryption for large data
3. **Key Derivation**: Define how keys are derived or provided
4. **Metadata Format**: Specify format for algorithm-specific metadata (nonces, IVs, tags)

## 7.4 Encryption Metadata

### 7.4.1 Algorithm-Specific Metadata

Each encryption algorithm defines its metadata requirements:

- Initialization vectors (IVs) or nonces
- Authentication tags
- Key identifiers
- Algorithm parameters

This metadata is stored:

- **Non-chunked**: Location defined by algorithm specification
- **Chunked**: After chunk data, before checksum (if present)

### 7.4.2 Metadata Inclusion in Checksums

When both DATUM_ENCRYPTED and DATUM_CHECKSUM are set:

- Checksums MUST include encryption metadata
- This ensures metadata integrity and prevents tampering

## 7.5 Chunked Encryption

When both DATUM_ENCRYPTED and DATUM_CHUNKED flags are set:

1. Each chunk is encrypted independently
2. Each chunk may have its own encryption metadata (e.g., unique nonce)
3. Chunk size refers to encrypted data size (including any padding)
4. Enables parallel encryption/decryption
5. Allows random access to chunks with appropriate key

Chunk structure with encryption:

```bnf
<chunk_id:8> <chunk_size:8> <encrypted_data> <encryption_metadata> <chunk_checksum>?
```

Where `chunk_size` = encrypted data size + encryption metadata size in bytes.

## 7.6 Key Management

### 7.6.1 Key Storage

Cryptdatum does NOT define key storage. Keys may be:

- Derived from passwords (using algorithm-specific KDF)
- Stored in external key management systems
- Embedded in custom header fields (not recommended)
- Managed by the application

### 7.6.2 Key Rotation

For chunked data:

- Different chunks MAY use different keys
- Key identifiers in encryption metadata enable key selection
- Implementations SHOULD support multi-key containers

## 7.7 Implementation Considerations

### 7.7.1 Padding

- Block ciphers may require padding
- Padding is included in encrypted data size
- Stream ciphers typically require no padding

### 7.7.2 Authentication

- AEAD modes provide built-in authentication
- Non-AEAD modes MUST use DATUM_SIGNED for integrity
- Authentication tags are part of encryption metadata

### 7.7.3 Performance

- Hardware acceleration SHOULD be used when available
- Chunked encryption enables parallel processing
- Consider cipher mode impact on random access

## 7.8 Security Considerations

### 7.8.1 Algorithm Selection

- Use only well-vetted encryption algorithms
- Avoid deprecated algorithms (DES, RC4, etc.)
- Consider post-quantum resistance for long-term data

### 7.8.2 Implementation Security

- Use cryptographically secure random number generators
- Never reuse nonces/IVs with the same key
- Clear keys from memory after use
- Implement constant-time operations where applicable

### 7.8.3 Metadata Protection

- Encryption metadata itself is not encrypted
- Use checksums/signatures to ensure metadata integrity
- Avoid leaking information through metadata size/patterns

## 7.9 Error Handling

Decryption failures MUST be treated as fatal errors:

- Do not return partial decrypted data
- Distinguish between wrong key and corrupted data when possible
- Set DATUM_COMPROMISED flag if keeping failed container
- Log security events appropriately
