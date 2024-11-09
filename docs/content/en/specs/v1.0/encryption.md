# Encryption

The Cryptdatum format uses encryption to protect the confidentiality and integrity of the data payload. Encryption is optional and can be enabled or disabled using the `DATUM ENCRYPTED (64)` flag in the header, together specifying the algorithm type using the `ENCRYPTION ALGORITHM` field.

The `ENCRYPTION ALGORITHM` header field is used to identify the encryption algorithm used to encrypt the data. The format currently commonly uses the XChaCha20-Poly1305 encryption algorithm, but it is designed to be flexible enough to accommodate other algorithms.

::: tip Key Points about Encryption
- **Encryption Flag**:
    - Enable encryption by setting the `DATUM ENCRYPTED (64)` flag in the header.

- **Algorithm Specification**:
    - The specific encryption algorithm used is specified in the `ENCRYPTION ALGORITHM` field of the header.

- **Encrypted Payload**:
    - When the data is encrypted, the PAYLOAD contains the encrypted data.
    - The encryption key and nonce used to encrypt the data are not stored in Cryptdatum but are typically exchanged out-of-band between the sender and receiver.

- **Order of Operations**:
    - Encryption should be applied to the data (optionally signed) before it is compressed. This is because encryption is more effective on random data, and compression can make the data more predictable, reducing the security of the encryption.
:::

### Example Use Cases

::: details Click to expand
- **Sensitive Data Protection**: Encrypting the payload ensures that sensitive data remains confidential and protected against unauthorized access. The `DATUM ENCRYPTED` flag and `ENCRYPTION ALGORITHM` field will indicate the use of encryption and the specific algorithm used.

- **Out-of-Band Key Exchange**: For secure communication, the encryption key and nonce can be exchanged out-of-band between the sender and receiver, ensuring that only authorized parties can decrypt and access the data.
:::

By supporting flexible encryption options, Cryptdatum ensures that the confidentiality and integrity of the data payload can be maintained according to the specific security requirements of various use cases. Implementations should carefully consider the order of encryption, signing, and compression to optimize security and performance.
