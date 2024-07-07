# Payload

```bnf
<cryptdatum> ::= <cryptdatum_header>
    | <cryptdatum_header> <metadata> 
    | <cryptdatum_header> <metadata> <signature> <payload> // [!code focus:6]
    | <cryptdatum_header> <metadata> <signature> <checksum_table> <payload>
    | <cryptdatum_header> <signature> <payload>
    | <cryptdatum_header> <signature> <checksum_table> <payload>
    | <cryptdatum_header> <checksum_table> <payload>
    | <cryptdatum_header> <payload>
```

The payload is the actual data contained within the Cryptdatum. The specification does not place any restrictions on the payload, aside from the requirement that it should be identifiable from the header and optional metadata on how the data should be handled. This includes cases where the data access is private or secret, as it should still be detectable from the header and metadata. If the data is not possible to detect or cannot be understood, the `DataInvalid` flag should be set for the data.

::: info Key Points about the Payload

1. **Identification and Handling:**
  - The payload should be identifiable from the information provided in the header and optional metadata.
  - The header fields and flags, along with the metadata if present, provide the necessary details on how to process the payload.

2. **Flexibility:**
  - The payload can contain any form of data, whether it is plain text, binary, encrypted, compressed, or a combination of these.
  - The payload may also include nested structures or additional Cryptdatum containers.

3. **Confidentiality and Integrity:**
  - If the payload is encrypted, the `DATUM_ENCRYPTED` flag in the header must be set, and the encryption algorithm specified in the header.
  - If the payload is signed, the `DATUM_SIGNED` flag should be set, and the signature type and size fields must be populated accordingly.

4. **Compression:**
  - The payload can be compressed to reduce its size, indicated by the `DATUM_COMPRESSED` flag in the header.
  - The specific compression algorithm used should be detailed in the `COMPRESSION_ALGORITHM` field of the header.

5. **Checksum:**
  - To ensure data integrity, a checksum can be calculated for the payload. The presence of a checksum is indicated by the `DATUM_CHECKSUM` flag.
  - The checksum is a CRC64 value, stored in the checksum field of the header.

6. **Chunked Data:**
  - For large payloads, data can be divided into chunks, as indicated by the `DATUM_CHUNKED` flag.
  - The chunk size is specified in the `CHUNK_SIZE` field, allowing efficient processing and transmission of large data sets.
:::

## Example Use Cases

