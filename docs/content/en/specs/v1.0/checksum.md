# Checksum

The checksum is an 8-byte value that is used to verify the integrity of the data. It is calculated using the CRC64 algorithm, which produces a unique checksum for a given data set.

The checksum is calculated by taking the following values as input:

```bnf
<checksum> ::= <cryptdatum_header>
    | <cryptdatum_header> <metadata>
    | <cryptdatum_header> <metadata> <signature> <payload>
    | <cryptdatum_header> <metadata> <signature> <checksum_table>
    | <cryptdatum_header> <signature> <payload>
    | <cryptdatum_header> <signature> <checksum_table>
    | <cryptdatum_header> <checksum_table>
    | <cryptdatum_header> <payload>
```

::: info Checksum Calculation

- `<checksum>` ::= `<cryptdatum_header>`
The checksum is the CRC64 checksum of `<cryptdatum_header>`.
- `<checksum>` ::= `<cryptdatum_header> <metadata>`
The checksum is the CRC64 checksum over the combined checksums of `<cryptdatum_header>` and `<metadata>`.
- `<checksum>` ::= `<cryptdatum_header> <metadata> <signature> <payload>`
The checksum is the CRC64 checksum over the combined checksums of `<cryptdatum_header> <metadata> <signature>` and `<payload>`.
- `<checksum>` ::= `<cryptdatum_header> <metadata> <signature> <checksum_table> <payload>`
The checksum is the CRC64 checksum over the combined checksums of `<cryptdatum_header>, <metadata>, <signature>`, and `<checksum_table>`.
- `<checksum>` ::= `<cryptdatum_header> <signature> <payload>`
The checksum is the CRC64 checksum over the combined checksums of `<cryptdatum_header>, <signature>` and `<payload>`.
- `<checksum>` ::= `<cryptdatum_header> <signature> <checksum_table> <payload>`
The checksum is the CRC64 checksum over the combined checksums of `<cryptdatum_header>, <signature>` and `<checksum_table>`.
- `<checksum>` ::= `<cryptdatum_header> <checksum_table> <payload>`
The checksum is the CRC64 checksum over the combined checksums of `<cryptdatum_header>` and `<checksum_table>`.
- `<checksum>` ::= `<cryptdatum_header> <payload>`
The checksum is the CRC64 checksum over the combined checksums of `<cryptdatum_header>` and `<payload>`.
:::

Header checksum is the only field excluded when calculating the header checksum.

The CRC64 algorithm with ISO polynomial, defined in ISO 3309 and used in HDLC, is applied to these values to generate a 64-bit checksum value. This value is then stored in the checksum field of the header.

When the data is received, the checksum should be recalculated and compared to the value stored in the header. If the checksums do not match, it is likely that the data has been corrupted or tampered with. This helps ensure the integrity of the data and detect errors in transmission.

It's important to note that the checksum is calculated over the uncompressed payload data. This allows for the ability to change the compression algorithm even after the data is signed and checksummed.

It's also worth noting that the design decision to encrypt the data before compression is because encryption is more effective on random data, and compression can make the data more predictable, reducing the security of the encryption. However, compressing the data first and then encrypting it can still provide a reasonable level of security and may be more efficient in some cases. Cryptdatum allows for this use case, therefore providing already compressed data to Cryptdatum encoder and only using its built-in encryption mechanism is a valid use. In this case, the compression flag bit must be omitted so that encoders/decoders would not load compression utilities and attempt to decompress the data before decrypting. The Compression Algorithm header field can still be used to set the compression algorithm, but implementations should take into account the security implications of this approach. Additionally, if the data is being sent over a network and bandwidth or speed is a concern due to data size, distance between peers or transport medium capabilities, it may be more efficient to compress the data first to reduce the amount of data that needs to be transmitted.

