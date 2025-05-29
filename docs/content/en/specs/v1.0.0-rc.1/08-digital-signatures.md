# 8. Digital Signatures

## 8.1 Overview

Digital signatures provide authentication, integrity, and non-repudiation for Cryptdatum containers. When the DATUM_SIGNED flag is set, the container includes a digital signature using the algorithm specified in the SIGNATURE_ALGORITHM header field.

## 8.2 Prerequisites

### 8.2.1 Checksum Requirement

DATUM_CHECKSUM MUST be set when DATUM_SIGNED is set. This ensures:

- Data integrity through checksums
- Authentication through signatures
- A well-defined signing scope

### 8.2.2 Flag Dependencies

```text
DATUM_SIGNED = 1 requires DATUM_CHECKSUM = 1
```

Implementations MUST reject containers where DATUM_SIGNED is set but DATUM_CHECKSUM is not.

## 8.3 Signature Coverage

### 8.3.1 What Gets Signed

The signature covers:

- The meta-checksum value from the checksum block
- This meta-checksum already ensures integrity of:
  - Header bytes (0-65, 78-127)
  - Metadata content (via metadata checksum)
  - Payload data (via payload checksum or chunk hierarchy)

By signing the meta-checksum, the signature transitively authenticates all data covered by checksums.

### 8.3.2 Signing Process

1. Calculate all checksums and meta-checksum as normal (see Section 5)
2. Read meta-checksum value from checksum block
3. Generate signature over the meta-checksum value
4. Store signature in signature block
5. If the signature algorithm requires its own integrity checksum, this is independent of the meta-checksum

## 8.4 Signature Block Structure

When DATUM_SIGNED is set:

```bnf
<signature_block> ::= <signature_data>
```

The structure of `signature_data` is defined by the signature algorithm, which specifies:

- Size field format and width
- Signature encoding (e.g., DER, raw bytes)
- Public key or key identifier location
- Whether signature includes its own checksum

## 8.5 External Signatures

Some use cases require signatures to be stored separately from the container:

### 8.5.1 External Signature Indicators

Algorithms supporting external signatures define how to indicate this, typically:

- Special value in signature block (e.g., size = 0)
- Reference identifier for external lookup
- URL or path to signature file

### 8.5.2 External Signature Format

External signatures SHOULD include:

- Container identifier (e.g., hash of header)
- Timestamp of signature creation
- The actual signature data
- Signer identification

## 8.6 Verification Process

### 8.6.1 Full Verification

1. Verify all checksums first, including meta-checksum (see Section 5)
2. Extract signature from signature block
3. Extract the verified meta-checksum value
4. Verify signature over the meta-checksum value using appropriate public key
5. Check signature validity (not expired, not revoked)
6. If signature has its own integrity checksum, verify it separately

### 8.6.2 Optional Verification

Signature verification MAY be skipped when:

- Only data access is needed (not authenticity)
- Signature will be verified later in processing
- Container is from a trusted source

Note: Skipping verification does not affect checksum verification requirements.

## 8.7 Multiple Signatures

### 8.7.1 Single Algorithm, Multiple Signers

When multiple parties must sign the same container:

- Use external signatures for additional signers
- Or create container with array of signatures (algorithm-specific)

### 8.7.2 Algorithm Migration

For algorithm transitions:

- Create new container with new algorithm
- Keep old container for compatibility period
- Do not mix signature algorithms in one container

## 8.8 Implementation Considerations

### 8.8.1 Key Management

- Public keys may be embedded in signature block
- Or referenced by key ID for external lookup
- Consider key rotation and expiration
- Support standard key formats (PEM, DER, JWK)

### 8.8.2 Performance

- Signature generation/verification is computationally expensive
- Cache verification results when processing multiple times
- Consider batch verification for multiple containers
- Use hardware acceleration when available

### 8.8.3 Signature Formats

Common signature encodings include:

- Raw concatenated r,s values (ECDSA)
- DER-encoded signatures (RSA, DSA)
- Structured formats with metadata

The algorithm specification defines the required format.

## 8.9 Security Considerations

### 8.9.1 Algorithm Selection

- Use appropriate key sizes for security level
- Consider quantum-resistant algorithms for long-term security
- Avoid deprecated algorithms (RSA-1024, SHA-1 based)
- Match signature algorithm strength to data sensitivity

### 8.9.2 Implementation Security

- Protect private keys appropriately
- Use secure random number generation
- Implement timing-attack resistant operations
- Validate all inputs before signing

### 8.9.3 Trust Considerations

- Signature only proves who signed, not trustworthiness
- Implement certificate/key validation as needed
- Consider revocation checking requirements
- Document trust model clearly

## 8.10 Error Handling

Signature verification failures:

- MUST be clearly distinguished from checksum failures
- SHOULD indicate reason (invalid signature, wrong key, expired)
- MAY set DATUM_COMPROMISED flag if keeping container
- MUST NOT return data as authenticated
