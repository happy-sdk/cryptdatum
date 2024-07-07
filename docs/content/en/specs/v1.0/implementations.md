# Implementations

Cryptdatum official implementations in different languages **MUST** export a public API that exposes the Cryptdatum constant values and flag enums defined in the specification.

The official implementation should provide language-specific interfaces for encoding and decoding, encryption and decryption, and signing and signature verification.

::: tip Implementation Guidelines
- **Public API**:
    - The official language-specific implementations **SHOULD** provide a public API and implement functionality to check if byte data has a header and if the header is valid according to the specification.
    - They **SHOULD** also implement and expose minimal Cryptdatum data encoding and decoding API.
    - Additional features such as specific compression, encryption, and signing support should be implemented in higher-level libraries.

- **Dependency Management**:
    - Official implementations **MUST NOT** introduce external and third-party dependencies.
    - The API **MUST** be implemented using the language-specific standard library only.

- **Version Exposure**:
    - Implementations **MUST** expose an API to get the semantic version of the specification from the Version field value, at least in the range of the current major semantic version.
:::

### Key Implementation Requirements

1. **Exposing Cryptdatum Constants and Flags**:
    - The public API should expose all constant values and flag enums defined in the Cryptdatum specification.

2. **Encoding and Decoding**:
    - Provide interfaces for encoding and decoding data according to the Cryptdatum format.

3. **Encryption and Decryption**:
    - Implement encryption and decryption functionalities as specified in the Cryptdatum standard.

4. **Signing and Signature Verification**:
    - Include support for data signing and signature verification.

5. **Header Validation**:
    - Implement functionality to check if byte data contains a valid Cryptdatum header.

6. **Minimal Data API**:
    - Ensure the public API includes minimal Cryptdatum data encoding and decoding functionalities, keeping the library lightweight and maintainable.

### Maintaining Lightweight Libraries

By adhering to these guidelines, the official Cryptdatum language-specific libraries will remain lightweight and easier to maintain in line with the evolving specification. This approach ensures that the implementations are robust, efficient, and consistent across different languages.

Implementers should design their systems to easily adapt to version increments and ensure backward compatibility where feasible, particularly for minor version updates.
