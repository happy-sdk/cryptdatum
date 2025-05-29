---
title: API Guidelines
layout: doc
editLink: true
---

# API Guidelines

::: warning Proposal
This API specification is currently a proposal and may change. The core concepts and requirements are stable, but specific function signatures, parameter names, and implementation details may be adjusted based on implementation feedback and real-world usage.
:::

This section defines the core API that official implementations must expose. While function names and parameter styles should follow language-specific conventions, the semantic meaning must remain consistent across all implementations.

## Core API Functions

### Header Operations

#### `has_header`

Checks if the provided data contains a Cryptdatum header by verifying the magic bytes and basic structure.

- **Parameters**:
  - `data` (byte array): The data to check
- **Returns**:
  - `boolean`: True if magic bytes and basic structure match
- **Notes**:
  - Only checks magic bytes and basic structure
  - Does not validate checksums or other fields
  - Should be fast and non-blocking

#### `validate_header`

Validates a Cryptdatum header according to the specification.

- **Parameters**:
  - `data` (byte array): The data to validate
- **Returns**:
  - `boolean`: True if header is valid
- **Notes**:
  - Validates all header fields
  - Checks header checksum
  - Verifies field alignments and sizes

### Container Operations

#### `create_container`

Creates a new Cryptdatum container with the specified parameters.

- **Parameters**:
  - `options` (object): Container creation options
    - `compression` (uint32): Compression algorithm ID
    - `encryption` (uint32): Encryption algorithm ID
    - `checksum` (uint32): Checksum algorithm ID
    - `chunk_size` (uint64): Max size of chunks in bytes
    - `flags` (uint16): Container flags
- **Returns**:
  - `Container`: New container instance
- **Notes**:
  - Validates algorithm IDs
  - Sets up appropriate headers
  - Initializes algorithms

#### `open_container`

Opens an existing Cryptdatum container for reading.

- **Parameters**:
  - `data` (byte array): Container data
  - `options` (object): Optional opening parameters
- **Returns**:
  - `Container`: Container instance
- **Notes**:
  - Validates container structure
  - Checks algorithm support
  - Sets up decryption if needed

### Data Operations

#### `write_data`

Writes data to a container.

- **Parameters**:
  - `container` (Container): Target container
  - `data` (byte array): Data to write
  - `options` (object): Write options
    - `compress` (boolean): Whether to compress
    - `encrypt` (boolean): Whether to encrypt
- **Returns**:
  - `uint64`: Number of bytes written
- **Notes**:
  - Handles chunking automatically
  - Updates container metadata
  - Manages compression/encryption

#### `read_data`

Reads data from a container.

- **Parameters**:
  - `container` (Container): Source container
  - `options` (object): Read options
    - `decompress` (boolean): Whether to decompress
    - `decrypt` (boolean): Whether to decrypt
- **Returns**:
  - `byte array`: Read data
- **Notes**:
  - Handles chunk reading
  - Manages decompression/decryption
  - Validates checksums

### Stream Operations

#### `create_stream`

Creates a new stream container.

- **Parameters**:
  - `options` (object): Stream options
    - `stream_id` (byte array): Stream identifier
    - `fragment_size` (uint64): Fragment size
    - `flags` (uint16): Stream flags
- **Returns**:
  - `Stream`: Stream instance
- **Notes**:
  - Sets up stream metadata
  - Initializes stream state

#### `write_fragment`

Writes a fragment to a stream.

- **Parameters**:
  - `stream` (Stream): Target stream
  - `data` (byte array): Fragment data
  - `sequence` (uint64): Fragment sequence number
- **Returns**:
  - `boolean`: Success status
- **Notes**:
  - Validates fragment size
  - Updates stream metadata
  - Handles stream flags

## Error Handling

All functions must follow the error handling guidelines specified in the [Error Handling](../error-handling.md) section. This includes:

- Using appropriate error types
- Providing clear error messages
- Handling algorithm-specific errors
- Managing resource cleanup

## Implementation Notes

- Functions must be thread-safe where appropriate
- Resource management must be explicit
- Error handling must be consistent
- Performance should be considered for large operations
- Memory usage should be predictable

::: tip Best Practices

- Use language-specific idioms while maintaining semantic consistency
- Document all parameters and return values
- Provide clear error messages
- Include usage examples
- Consider performance implications
:::
