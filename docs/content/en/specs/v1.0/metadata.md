# Metadata

The Cryptdatum header allows for the inclusion of metadata to provide additional information about the data payload. Metadata can be used to define custom metadata or to use one of the [built-in metadata schemas](#built-in-metadata-schemas).

When data is encrypted, metadata **SHALL** be used with care to avoid leaking or hinting at the payload contents. Proper handling of metadata is crucial to maintaining the confidentiality of the encrypted data.

[Built-in metadata schemas](#built-in-metadata-schemas) provide flexibility, allowing the specification to support various use cases without maintaining an extensive list of metadata schemes.

Metadata that follows an external standard should include the standard name and version in the schema, and the body of the metadata should conform to that standard.

```bnf
<cryptdatum> ::= <cryptdatum_header>
    | <cryptdatum_header> <metadata> // [!code focus:3]
    | <cryptdatum_header> <metadata> <signature> <payload>
    | <cryptdatum_header> <metadata> <signature> <checksum_table> <payload>
    | <cryptdatum_header> <signature> <payload>
    | <cryptdatum_header> <signature> <checksum_table> <payload>
    | <cryptdatum_header> <checksum_table> <payload>
    | <cryptdatum_header> <payload>
```

## Metadata Guidelines:
- Metadata should be minimal and only include necessary information to avoid increasing the size of the Cryptdatum container unnecessarily.
- Metadata can be used to provide context about the data, such as its structure, origin, or intended use.
- Care must be taken to ensure that metadata does not compromise the security or privacy of the data payload.

## Built-in Metadata Schemas

*TBD*

Built-in metadata schemas could define various types of information related to the data payload. Here are some examples of potential built-in metadata schemas:

- **File Metadata**: This schema could be used when the Cryptdatum contains an extractable file, providing information such as the file name, extension, and default permissions.
- **File List Metadata**: If the Cryptdatum contains a list of files instead of a single file, this schema could include information about how to extract the files, their names, and sizes.
- **Network Metadata**: This schema could be used to wrap another Cryptdatum, providing information about the timestamp and the network or authority that created or first saw the data. These rules are determined by the network or authority.
- **Custom Metadata**: Users can define custom metadata schemas to include specific information relevant to their use cases. This flexibility allows for the adaptation of the Cryptdatum format to various applications and domains.

## Summary

Metadata in the Cryptdatum format provides a powerful way to include additional information about the data payload. By supporting both custom and built-in metadata schemas, the specification offers flexibility while maintaining security and privacy. Proper use of metadata ensures that the data payload is well-documented and easier to manage without compromising the integrity and confidentiality of the data.
