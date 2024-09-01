# File Extension

The Cryptdatum format uses the `.cdatum` file extension to indicate that a file contains data stored in the Cryptdatum format. The file consists of a 64-byte header followed by the payload data. This header contains information such as the version number, encryption and compression flags, and the size of the payload data.

::: tip Key Points about `.cdatum` File Extension
- **Header Information**:
    - The 64-byte header contains crucial information including the version number, encryption and compression flags, and the size of the payload data.

- **Payload Data**:
    - The payload data can be in various forms:
        - Original data as byte array
        - Encrypted data
        - Compressed and encrypted data
    - The specific form of the payload data depends on the flags set in the header.

- **Extension Purpose**:
    - The `.cdatum` file extension does not indicate the type of data stored in the file.
    - It only signifies that the file is in the Cryptdatum format and can be read and processed by software that supports the Cryptdatum format.
:::

### Example Use Cases

::: details Click to expand
- **Data Interchange**: Using the `.cdatum` file extension facilitates the interchange of data between systems that support the Cryptdatum format, ensuring compatibility and correct interpretation of the file contents.

- **Software Integration**: Developers can design software to recognize and handle `.cdatum` files appropriately, leveraging the header information to process the payload data correctly.
:::

By using the `.cdatum` file extension, Cryptdatum ensures that files conforming to the Cryptdatum format are easily identifiable and can be properly managed by supporting software, maintaining the integrity and compatibility of the data.
