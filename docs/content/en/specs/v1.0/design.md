# Design

The Cryptdatum format consists of a 64-byte header followed by the payload. The header contains information about the data and used Cryptdatum features, including a magic number, version number, timestamp, operation counter, checksum, flags, total size of datum, compression algorithm (if used), encryption algorithm (if data is encrypted), signature size field (if data is signed), and metadata type (if metadata is present).

## Structure of a Valid Cryptdatum

The structure of a valid Cryptdatum is as follows:

```bnf
<cryptdatum> ::= <cryptdatum_header>
    | <cryptdatum_header> <metadata>
    | <cryptdatum_header> <metadata> <signature> <payload>
    | <cryptdatum_header> <metadata> <signature> <checksum_table> <payload>
    | <cryptdatum_header> <signature> <payload>
    | <cryptdatum_header> <signature> <checksum_table> <payload>
    | <cryptdatum_header> <checksum_table> <payload>
    | <cryptdatum_header> <payload>
```

The optional metadata, signature, chunk table, and payload are stored after the header. The structure of the data after the header will depend on the flags and feature field values in the header.

::: tip Header Information
The 64-byte header of a Cryptdatum contains the following fields:

- **Magic Number**: A unique identifier for the Cryptdatum format.
- **Flags**: Various flags indicating features and properties of the Cryptdatum.
- **Timestamp**: The time when the Cryptdatum was created.
- **Size**: The total size of the Cryptdatum payload.
- **Version**: Indicates the version of the Cryptdatum format.
- **Chunk Size**: If the data is chunked, indicates the size of each chunk.
- **Operation Counter**: A counter for operations performed on the Cryptdatum.
- **Network ID**: An identifier for the network in which the Cryptdatum was created.
- **Metadata Size**: The size of the metadata, if present.
- **Checksum**: A checksum for validating the integrity of the header.
- **Compression Algorithm**: If the data is compressed, indicates the algorithm used.
- **Encryption Algorithm**: If the data is encrypted, indicates the algorithm used.
- **Signature Type**: Indicates the type of signature used.
- **Signature Size**: If the data is signed, indicates the size of the signature.
- **Metadata Spec**: If metadata is present, indicates the specification of the metadata.
- **Delimiter**: A delimiter used in the header.
:::

## Notes

::: tip **Metadata**
If the metadata flag bit *DATUM METADATA (1024)* is set, the *METADATA SPEC* and *METADATA SIZE* field values can be used by the decoder to determine how to parse metadata from the beginning of the payload.
:::

::: tip **Chunked Data**
If the *CHUNK SIZE* field is greater than 0 and the *DATUM CHUNKED (512)* flag bit is set, the data can be streamed and processed in chunks. `<checksum_table>` MUST be used to register chuck checksums.
:::

::: tip **Compression**
If the compression flag bit *DATUM COMPRESSED (32)* is set, the *COMPRESSION ALGORITHM* header field represents the compression algorithm used so that the decoder can decide how to decompress the data.
:::

::: tip **Encryption**
If the encryption flag bit *DATUM ENCRYPTED (64)* is set, the *ENCRYPTION ALGORITHM* header field represents the encryption algorithm used so that the decoder can decide how to decrypt the data.
:::
