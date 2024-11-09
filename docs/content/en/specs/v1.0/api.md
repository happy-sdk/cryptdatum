# API

This section covers the API that official low-level language-specific implementations should expose. The naming of functions and parameters should follow language-specific best practices, as long as their meaning is easily recognizable across language domains.

::: tip API Guidelines
- **Consistency**:
    - Ensure the API naming conventions and parameter usage follow language-specific best practices.
    - Maintain consistency in the meaning of functions and parameters across different language implementations.
:::

### Core API Functions

#### `has_header`

This function checks if the provided data contains a Cryptdatum header. It looks for specific header fields and checks their alignment, but does not perform any further validations. If the data is likely to be Cryptdatum, the function **MUST** return true. Otherwise, it **MUST** return false.

- **Parameters**: 
    - `data` (byte array): The data to be checked for a Cryptdatum header.
- **Returns**: 
    - `boolean`: True if the data contains a Cryptdatum header, otherwise false.

#### `has_valid_header`

This function **MUST** check if the provided data contains a valid Cryptdatum header. It verifies the integrity of the header by checking the magic number, delimiter, and other fields. If the header is valid, the function **MUST** return true. Otherwise, it **MUST** return false.

- **Parameters**: 
    - `data` (byte array): The data to be validated as a Cryptdatum header.
- **Returns**: 
    - `boolean`: True if the header is valid, otherwise false.

### Additional API Functions

Implementations **SHOULD** also expose additional functions for encoding, decoding, encryption, decryption, signing, and signature verification as specified in the Cryptdatum standard.

::: tip Example Use Cases
- **Header Detection**: Use `has_header` to quickly check if a given data byte array likely contains a Cryptdatum header.
- **Header Validation**: Use `is_valid_header` to verify the integrity of the header and ensure it adheres to the Cryptdatum specification.
:::

By following these API guidelines and ensuring consistency across different language implementations, the Cryptdatum format can maintain robust and interoperable support in various programming environments.
