# Data Signing

The Cryptdatum format allows for data signing to ensure the integrity and authenticity of the payload. The format does not enforce any specific signing algorithm, but it is designed to accommodate various algorithms. The specific algorithm used can be identified from the `SIGNING ALGORITHM` field in the header.

::: tip Data Signing Flexibility
- **Before or After Encryption**: Data signing can be applied to the payload data either before or after encryption, depending on the use case. 
    - In some scenarios, it may be desirable to sign plaintext data.
    - In other cases, it may be more secure to sign the encrypted data.

- **Signature Inclusion**: Some signing algorithms may not include the signature itself as part of the payload but instead provide a mechanism for verifying the signature. The Cryptdatum format accommodates such signing algorithms as well. In these cases, the `SIGNATURE SIZE` field may have a value of 0 even when the data is signed.
:::

### Key Points about Data Signing

1. **Identification**:
    - The specific signing algorithm used is identified by the `SIGNING ALGORITHM` field in the header.

2. **Application of Signing**:
    - Data signing can be applied before or after encryption, depending on the security requirements.
    - Signing plaintext data might be suitable for scenarios where the data integrity needs to be verifiable before decryption.
    - Signing encrypted data ensures that both the data and its encryption can be verified together, enhancing security.

3. **Signature Storage**:
    - If the signing algorithm includes the signature as part of the payload, the `SIGNATURE SIZE` field will reflect the size of the signature.
    - For algorithms that provide a verification mechanism without storing the signature in the payload, the `SIGNATURE SIZE` field may be set to 0.

### Example Use Cases

::: details Click to expand
- **Pre-Encryption Signing**: In cases where data integrity needs to be verified before decryption, sign the plaintext data before applying encryption. This allows the recipient to verify the data's integrity before decrypting it.

- **Post-Encryption Signing**: For enhanced security, sign the encrypted data. This ensures that any tampering with the encrypted data can be detected during the verification process.
:::

By allowing flexible data signing options, Cryptdatum ensures that the integrity and authenticity of the payload can be maintained according to the specific security requirements of various use cases.
