# Feature Flags

The following feature flags have been defined by the current specification and must be applied to the "Flags" header field when the corresponding feature is used. These flags ensure backward compatibility and future revisions may only append new flags, not modify existing ones. The value can be set with one byte Datum Flag enums. Datum Flag is a bitmask set of booleans represented by the bits in a single number.

## DATUM INVALID

::: info `1`
This flag is set when the Cryptdatum format is correct, but the header validation fails or the payload data is deemed invalid. It serves as a more general alternative to the *DATUM COMPROMISED (2048)* flag. For example, network nodes can use this flag to optimize resource usage by marking Cryptdatum containers as invalid, allowing other nodes to know to ignore processing it when this flag is set.
:::

## DATUM DRAFT

::: info `2`
This flag is set when datum is in draft state, therefore its values cannot be trusted.
:::

## DATUM EMPTY

::: info `4`
This flag indicates that Cryptdatum does not contain any payload. This flag can be used together with *DATUM METADATA (1024)*. For example, `<cryptdatum_header> <metadata>` is a valid use case.
:::

## DATUM CHECKSUM

::: info `8`
Indicates that checksum is calculated and checksum value is available in the Checksum header field.
:::

## DATUM OPC

::: info `16`
Indicates that datum has an operation counter value set in the header (opc).
:::

## DATUM COMPRESSED

::: info `32`
Indicates that the datum payload is compressed and the algorithm used for compression can be looked up from the Compression Algorithm header field, which MUST be set when this flag bit is set.
:::

## DATUM ENCRYPTED

::: info `64`
Indicates that the datum payload is encrypted and the algorithm used for encryption can be looked up from the Encryption Algorithm header field, which MUST be set when this flag bit is set.
:::

## DATUM EXTRACTABLE

::: info `128`
When set, it indicates that the payload can be processed externally. For example, the metadata, when set, may define how to extract the payload. This allows the offloading of post-processing of the payload to other interpreters or programs associated with the file extension. While the payload still can use Cryptdatum compression and encryption algorithms, it provides extreme flexibility to offload that to external programs. For example, Cryptdatum can hold compressed and encrypted data as the payload, in which case using Cryptdatum's compression and encryption algorithms would not make much sense. However, you still may want to leverage Cryptdatum's signing and checksum features.
:::

## DATUM SIGNED

::: info `256`
Indicates that datum has been signed. In this case, the Signature Type header field can be used to look up the signature type to decide how the signature can be verified. When the Signature Size field is also set to a value greater than 0, it MUST indicate that the signature is included in datum and the signature size length in bytes so that it can be extracted from between the header and actual payload or right after metadata if used.
:::

## DATUM CHUNKED

::: info `512`
Indicates that the datum payload is chunked and streamable and can be decoded from the stream resource when the receiver has appropriate support for such a decoder instead of processing all the payload at once. The ChunkSize header field **MUST** indicate the size of the chunk when this bit is set.
:::

## DATUM METADATA

::: info `1024`
This flag indicates that metadata is present in the Cryptdatum container. The *METADATA SIZE* field MUST indicate the size of the metadata in bytes, following the header. Additionally, the *METADATA SPEC* field must be set to a value that defines the metadata specification used, so that implementations know how to read and interpret the metadata. For more information on metadata, please refer to the Metadata section.
:::

## DATUM COMPROMISED

::: info `2048`
This flag indicates that there are concerns about the integrity of the payload data in a Cryptdatum. This may occur if a checksum check fails or if the signature is invalid. When this flag is set, receivers should be cautious when processing the payload. The meaning of this flag can vary based on the individual use-case, and it may be helpful for the source to provide additional context about why the flag was set. However, this is not part of the specification. Implementations may create custom behavior around this flag, but header parsers must indicate that the header is invalid when this flag is set. One way to handle this would be to unset the Datum Compromised bit and set the Datum Draft bit.
:::

## DATUM CHECKSUM TABLE

::: info `4096`
Indicates that a checksum table is used after the header to store chunk checksums instead of storing them at the beginning of each chunk.
:::

## DATUM NETWORK

::: info `8192`
Indicates that datum has a *`NETWORK ID`* value set in the header.
:::

