# Compression

Cryptdatum supports data compression to reduce the size of the data payload and improve transmission efficiency. Compression is optional and can be enabled or disabled using the Compression flag in the header.

When the Compression flag is set, it indicates that the payload has been compressed using the algorithm specified in the Compression Algorithm field of the header. Implementations should use this field to determine the appropriate decompression algorithm to use.

::: tip Key Points about Compression
- **Order of Operations**:
    - Compression is applied to the payload data after encryption and signing, if used. This is because encryption is more effective on random data, and compression can make the data more predictable, reducing the security of the encryption.
    - However, compressing the data first and then encrypting it can still provide a reasonable level of security and may be more efficient in some cases.

- **Omitting Compression Flag**:
    - If already compressed data is provided to the Cryptdatum encoder and only the built-in encryption mechanism is used, the Compression flag bit **MUST** be omitted. This ensures that encoders/decoders do not load compression utilities and attempt to decompress the data before decrypting it.

- **Setting Compression Algorithm**:
    - The Compression Algorithm header field can still be used to set the compression algorithm. Implementations **SHOULD** consider security implications when deciding the order of compression and encryption.
:::

### Example Use Cases

::: details Click to expand
- **Network Efficiency**: If the data is being sent over a network and bandwidth or speed is a concern due to data size, distance between peers, or transport medium capabilities, it may be more efficient to compress the data first to reduce the amount of data that needs to be transmitted.

- **Pre-Compressed Data**: When using pre-compressed data with the Cryptdatum format, ensure the Compression flag is omitted to avoid unnecessary decompression and recompression steps. This approach can optimize performance and maintain data integrity.
:::

By supporting flexible compression options, Cryptdatum allows for efficient data storage and transmission while maintaining the security and integrity of the payload. Implementations should carefully consider the order of operations and the specific use cases to optimize performance and security.
