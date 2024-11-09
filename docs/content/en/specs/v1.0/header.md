---
outline: deep
---

# Cryptdatum Header

The Cryptdatum header is a `64-byte` block of data that contains important information about the data payload. This information is used to identify the data as a Cryptdatum datum, as well as to indicate which features are being used by the datum. This information is crucial for properly interpreting and handling the data payload.


## Header Structure

| Field                                | Value Type              | Size | Required                               |
| ------------------------------------ | ----------------------- | ---- | -------------------------------------- |
| **[MAGIC](#magic)**    | byte array              | 4    | <Badge type="warning" text="Yes" />    |
| **[FLAGS](#flags)**                  | unsigned 64-bit integer | 8    | <Badge type="warning" text="Yes" />    |
| **[TIMESTAMP](#timestamp)**          | unsigned 64-bit integer | 8    | <Badge type="warning" text="Yes" />    |
| **[SIZE](#size)**                    | unsigned 64-bit integer | 8    | <Badge type="warning" text="Yes" />    |
| **[VERSION](#version)**              | unsigned 16-bit integer | 2    | <Badge type="warning" text="Yes" />    |
| **[CHUNK SIZE](#chunk-size)**        | unsigned 16-bit integer | 2    | <Badge type="info" text="Optional" />  |
| **[OPERATION COUNTER](#operation-counter)** | unsigned 32-bit integer | 4  | <Badge type="info" text="Optional" />  |
| **[NETWORK ID](#network-id)**        | unsigned 32-bit integer | 4    | <Badge type="info" text="Optional" />  |
| **[METADATA SIZE](#metadata-size)**  | unsigned 32-bit integer | 4    | <Badge type="info" text="Optional" />  |
| **[CHECKSUM](#checksum)**            | unsigned 64-bit integer | 8    | <Badge type="info" text="Optional" />  |
| **[COMPRESSION ALGORITHM](#compression-algorithm)** | unsigned 16-bit integer | 2 | <Badge type="info" text="Optional" />  |
| **[ENCRYPTION ALGORITHM](#encryption-algorithm)**  | unsigned 16-bit integer | 2 | <Badge type="info" text="Optional" />  |
| **[SIGNATURE TYPE](#signature-type)**| unsigned 16-bit integer | 2    | <Badge type="info" text="Optional" />  |
| **[SIGNATURE SIZE](#signature-size)**| unsigned 16-bit integer | 2    | <Badge type="info" text="Optional" />  |
| **[METADATA SPEC](#metadata-spec)**  | unsigned 16-bit integer | 2    | <Badge type="info" text="Optional" />  |
| **[DELIMITER](#delimiter)**          | byte array              | 2    | <Badge type="warning" text="Yes" />    |



## Header Fields

*Header **MUST** be considered valid only*

- when the length of the provided data is at least 64 bytes.
- when all the requirements specified in the Cryptdatum header format are met. This includes, but is not limited to, correct field values and correct ordering of fields.
- when fields that are not being used in the current header are filled with the `0x00` byte.
- when the **DELIMITER** field is set to the correct value, `0xA6, 0xE5`
- when the **MAGIC** field is set to the correct value, `0xA7, 0xF6, 0xE5, 0xD4`

### MAGIC <Badge type="warning" text="Required" />

**MAGIC** field is a 4-byte value that serves as an identifier for the header, specifically `0xA7, 0xF6, 0xE5, 0xD4`. This field helps to prevent the header from being confused with data belonging to another format. The purpose of the magic number is to provide a simple and quick way to check if the file is of the correct format before reading the rest of the header.

::: info *validation*
- first four magic bytes **MUST** equal to `0xA7, 0xF6, 0xE5, 0xD4`.
:::

### FLAGS <Badge type="warning" text="Required" />

**FLAGS** field is an 8-byte value that contains flag bits that indicate the presence of certain features or properties of the data. These can include whether the data is encrypted, compressed, or has other supported features enabled. Additional flags may be added in the future. See [Feature Flags](feature-flags) for the defined flag bit values and their meanings. Value of this field **MUST NOT** be 0 value. Common initial flag bit SHOULD be *DATUM DRAFT (2)*.  

::: info *validation*
- value **MUST** be 8 bytes representing unsigned 64-bit integer bitmask of applied flags.
- minimum valid value is 1 meaning that Cryptdatum is marked as invalid.
:::

### TIMESTAMP <Badge type="warning" text="Required" />

**TIMESTAMP** is an 8-byte value that contains a Unix timestamp in nanoseconds, indicating the time when the data was created. It can be used to order data by creation time and to determine the age of the data. The value of this field **MUST** always be set, with the minimum value being `Magic Date` `1652155382000000001`, which is the earliest timestamp when the first Cryptdatum container was created based on the initial specification. 

::: info *validation*
- field must be `8 bytes` in size and contain a `64-bit unsigned integer` representing the number of nanoseconds that have elapsed since the Unix epoch.
- Value MUST be creater than *Magic Date* `1652155382000000001`
:::

### SIZE

**SIZE** field is an 8-byte value that **SHALL** contain the total size of the cryptdatum data payload in bytes. This helps to ensure that the entire data payload has been received. It allows the decoder to know the amount of data to read in order to fully decode the Cryptdatum, for example when the datum is not chunked. Also in case of extractable data it makes it easier to allocate or ensure availability of sufficient storage space. When payload is in use and this field is set to value greater than 0 then *DATUM EMPTY (4)* flag bits **MUST NOT** be set. When *DATUM EMPTY (4)* flag is set then valu **MUST** be `0`

::: info *validation*

**When used**

- *DATUM EMPTY (4)* flag bit **MUST NOT** be set.
  
**When not used**

- *DATUM EMPTY (4)* flag bit **MUST** be set.
- field value **MUST** be `0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00`
:::

### VERSION 

**VERSION** field is a 2-byte representing `unsigned 16 bit integer` value that uniquely identifies the version of the Cryptdatum format. This allows the format to evolve over time without breaking backwards compatibility. See [Specification Versioning](specification-versioning) section for more information. Minumum value for version id field is 1. Each increment in the `VERSION` corresponds to a new release of the specification, whether it's a major overhaul or a minor improvement.

::: info *validation*

- version 2 bytes representing unsigned 16 bit integer MUST NOT be zero.
:::

### CHUNK SIZE

**CHUNK SIZE** field when set, indicates that the payload can be processed in chunks of size in Kilobytes rather than all at once. This is useful when the Cryptdatum holds very large data, which is hard to process at once, and enables data processors to delegate Cryptdatum processing in parallel. When data is chunked, the flag bit *DATUM CHUNKED (512)* **MUST** be set. For example, chunk size can be adjusted to find the best compression ratio. Chunking data can be useful when Cryptdatum holds very large data, which is hard to process at once or when the transport or storage medium would handle data in smaller chunks more efficiently. However, it should be noted that the current specification defines a maximum chunk size of 65535 kilobytes and a minimum of 1 kilobyte. Users who need smaller chunks may consider using a wrapper that breaks down the data into smaller chunks, while users who need larger chunks may consider concatenating multiple chunks of the maximum size.

::: info *validation*
**When used**

- *DATUM CHUNKED (512)* flag bit **MUST** be set 
- field value **MUST** be 2 byte value representing unsigned 16-bit integer with value greater than 0.

**When not used**

- *DATUM CHUNKED (512)* flag bit **MUST NOT** be set 
- field value must be `0x00, 0x00`.
:::

::: tip Chunk Size Recommendations
For optimal performance, the recommended chunk sizes are as follows:

- **Data Sent Over Network**: A chunk size of 16KB to 64KB is recommended to balance network efficiency and retransmission overhead. This range helps in maximizing the use of TCP/IP packets while minimizing the impact of packet loss.
  
- **Data Parsed Locally**: A chunk size of 64KB to 1MB is recommended to balance memory efficiency and processing overhead. This range allows efficient use of system memory and CPU caches, reducing the frequency of I/O operations.

**Implementation**

When implementing chunked checksums, the chunk size should be chosen based on the use case:
- For network transmission, smaller chunk sizes in the range of 16KB to 64KB should be used.
- For local parsing, larger chunk sizes in the range of 64KB to 1MB should be used.
::: 

### OPERATION COUNTER

**OPERATION COUNTER** field is a 4-byte value that can be used to assign an operation ID to the data when multiple datums are created with the same timestamp. This helps to add a serial identifier to each datum when timestamps are the same. It can be used to differentiate between multiple operations that produced that datum and were executed in parallel. When used, the flag bits *DATUM OPC (16)* **MUST** be set, and the minimum value of the operation counter field is then an unsigned integer 1. Although it is **RECOMMENDED** in general to enable implementations to order Cryptdatums with the same timestamp by the OPC field value, the specification **SHOULD NOT** restrict how this counter value is used. For example, implementations may use OPC and Timestamp fields accompanied by a Network ID field and treat it as a unique value, but the specification **SHALL NOT** define it as a unique value and leave it up to implementors to determine how they wish to treat this field.

::: info *validation*

**When used**

- *DATUM OPC (16)* flag bit **MUST** be set.
- field value **MUST** be 4 bytes representing unsigned 32-bit integer with value greater than 0.

**When not used**

- *DATUM OPC (16)* flag bit **MUST NOT** be set .
- field value must be `0x00, 0x00, 0x00, 0x00`.

:::

### NETWORK ID

**NETWORK ID** is an unsigned 32-bit integer that can be used to identify the source network of the payload. The specification does not strictly specify the usage of this field, but it is possible for there to be a decentralized or centralized registry for network IDs. This, however, does not prevent anyone from using their own Network ID registry in their own ecosystems. While a shared registry is **RECOMMENDED** for use in public, it is not required.

::: info *validation*
**When used**

- *DATUM NETWORK (8192)* flag bit **MUST** be set.
- field value **MUST** be 4 bytes representing unsigned 32-bit integer with value greater than 0.

**When not used**

- *DATUM NETWORK (8192)* flag bit **MUST NOT** be set .
- field value must be `0x00, 0x00, 0x00, 0x00`.
:::

### METADATA SIZE

**METADATA SIZE** field is a 4-byte value that indicates the size of the metadata present after the header. This field is required when the *DATUM METADATA (1024)* flag bit is set in the header to indicate that metadata is being used. The format of a valid Cryptdatum when metadata is used is as follows:

```ebnf
cryptdatum ::= cryptdatum_header metadata
             | cryptdatum_header metadata payload
             | cryptdatum_header metadata signature [ checksum_table ] payload
             | cryptdatum_header metadata checksum_table payload
```

It's important to note that the **METADATA SIZE** field is used to define the size of the metadata, for more information about metadata, see the [Metadata](metadata) section.


### CHECKSUM

**CHECKSUM** is an 8-byte value that contains a CRC64 checksum, used to verify data integrity. If the checksum does not match the data, it indicates possible corruption or tampering. When chunked, the CRC64 checksum for each chunk **MUST** be the first 8 bytes of the chunk unless the `DATUM CHECKSUM TABLE (16384)` flag is set, in which case checksums are stored in a `<checksum_table>` after the header. Implementations **SHALL** enforce the use of checksums, though they **SHALL NOT** treat the absence of a checksum as an error, as there may be valid use cases for omitting checksum generation.

The checksum mechanism in Cryptdatum ensures data integrity while optimizing memory usage through chunking.

- **Chunk Size**: Data is divided into fixed-size chunks (e.g., 1MB, 64KB), defined in the header.
- **Chunk Checksum**: Each chunk has an 8-byte CRC64 checksum.
- **Overall Checksum**: Calculated by combining individual chunk checksums.
- **Checksum Field**: The header includes an overall checksum field and a flag indicating the use of checksums.

::: info *Validation*

**When used:**
- The `DATUM CHECKSUM (8)` flag bit must be set.
- If the `DATUM CHECKSUM TABLE (16384)` flag bit is set, the checksum values for chunks **MUST** be stored in the `<checksum_table>`.
- The `CHUNK SIZE` field **MUST** specify the size of each chunk in kilobytes.
- The `CHECKSUM` header field must contain the CRC64 checksum of the combined chunk checksums.

**When not used:**
- The `DATUM CHECKSUM (8)` flag bit **MUST NOT** be set.
- The checksum field value **MUST** be `0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00`.
:::

### COMPRESSION ALGORITHM

**COMPRESSION ALGORITHM** field is a 2-byte value that indicates which compression algorithm was used, if any. When used, the flag bits *DATUM COMPRESSED (32)* **MUST** also be set to indicate that the data is compressed. See the [Compression](compression) section of this specification for more information.

::: info *validation*

**When used**
- *DATUM COMPRESSED (32)* flag bit **MUST** be set if payload is compressed by Cryptdatum compression mechanism.
- *DATUM COMPRESSED (32)* flag bit **MUST NOT** be set if payload is compressed by external compression mechanism.
- field value **MUST** be set to Comperssion algorithm used when used together with *DATUM COMPRESSED (32)* Cryptdatum compression mechanism
- field value **MAY** be set if *DATUM COMPRESSED (32)* is not set.

**When not used**

- *DATUM COMPRESSED (32)* flag bit **MUST NOT** be set.
:::

### ENCRYPTION ALGORITHM

**ENCRYPTION ALGORITHM** field is a 2-byte value that indicates the encryption algorithm used, if any. See the [Encryption](encryption) section of this specification for more information.

::: info *validation*
**When used**
- Field **MUST** contain 2 bytes indicating the encryption algorithm used.
- When used, the flag bits *DATUM ENCRYPTED (64)* **MUST** also be set to indicate that the data is encrypted
**When not used**
- *DATUM ENCRYPTED (64)* flag bit **MUST NOT** be set.
- The field value **MUST** be `0x00, 0x00`.
:::


### SIGNATURE TYPE

**SIGNATURE TYPE** field is a 2-byte unsigned 16-bit integer value that indicates what mechanism was used for signing the datum if it is signed. *DATUM SIGNED (256)* flag bits **MUST** be set when data is signed.

::: info *validation*

**When used** 

- *DATUM SIGNED (256)* flag bit **MUST** be set if payload is signed by Cryptdatum signing mechanism.
- field value **MUST** be set to Signing algorithm used.

**When not used**

- *DATUM SIGNED (256)* flag bit **MUST NOT** be set.
- field value **MUST** be `0x00, 0x00`
:::

### SIGNATURE SIZE

**SIGNATURE SIZE** field is a 2-byte value that contains the total size of the signature after the header for faster lookup of the signature data and the start location of the payload. The value of this field depends on the signature type field and therefore may not be set for some signing methods when the signature is not stored together with the data or is part of the encrypted payload. When used, the format would be in the following order:

```ebnf
cryptdatum ::= cryptdatum_header payload
             | cryptdatum_header signature payload
             | cryptdatum_header signature checksum_table payload
             | cryptdatum_header metadata signature payload
             | cryptdatum_header metadata signature checksum_table payload
```

Signing implementations should implement the most appropriate and secure use of these fields based on the given signing method.

::: info *validation*

**When used** 

- *DATUM SIGNED (256)* flag bit **MUST** be set if payload is signed by Cryptdatum signing mechanism.
- *SIGNATURE TYPE* field *MUST* be set to signing algorithm used for signing.
- field value **MAY** be set if signing algorithm requires signature to be included in payload. 

**When not used**

- *DATUM SIGNED (256)* flag bit **MUST NOT** be set.
- field value **MUST** be `0x00, 0x00`

:::

### METADATA SPEC

**METADATA SPEC** field is a 2-byte value that serves as an identifier for the metadata schema specification. This field is required when metadata is used, and must be set accordingly. Along with this field, the *DATUM METADATA (1024)* flag bit **MUST** also be set to indicate that metadata is being used. The **METADATA SIZE** field **MUST** indicate the size of the metadata. When used, the format of the metadata in a Cryptdatum datum is as follows: Here is an example of the general format of a valid Cryptdatum when metadata is used:

```ebnf
valid_cryptdatum ::= cryptdatum_header metadata
                   | cryptdatum_header metadata signature payload
                   | cryptdatum_header metadata payload
```

```ebnf
cryptdatum ::= cryptdatum_header metadata
             | cryptdatum_header metadata payload
             | cryptdatum_header metadata signature payload
             | cryptdatum_header metadata signature checksum_table payload
             | cryptdatum_header metadata checksum_table payload
```

Note that the metadata field can be combined with signature and payload, or be used alone depending on the desired use case and security requirements. For more information on the format and usage of metadata in a Cryptdatum, refer to the [Metadata](metadata) section.

::: info *validation* 

**When used** 

- *DATUM METADATA (1024)* flag bit **MUST** be set if metadata is used.
- field value **MUST** be set to indicate metadata specification used.

**When not used**

- *DATUM METADATA (1024)* flag bit **MUST NOT** be set.
- field value **MUST** be `0x00, 0x00`
:::


### DELIMITER

**DELIMITER** field is a 2-byte value, `0xA6, 0xE5`, that marks the end of the header. It serves as a marker to distinguish the header from the data payload, and ensure that the header is properly parsed by the decoder. The specific values of the delimiter bytes are arbitrary and do not hold any meaning.

::: info *validation* 

- last two bytes of the header **MUST** be equal to `0xA6, 0xE5`.
:::
