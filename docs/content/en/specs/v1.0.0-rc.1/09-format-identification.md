# 9. Format Identification

## 9.1 Overview

Cryptdatum containers can be identified through multiple mechanisms: magic bytes, file extensions, MIME types, and format-specific patterns. This section defines the standard identification methods.

## 9.2 Magic Bytes

### 9.2.1 Header Magic

Every Cryptdatum container begins with a 4-byte magic number:

```text
Offset 0: 0xA7 0xF6 0xE5 0xD4
```

In various representations:

- Hexadecimal: `A7F6E5D4`
- Decimal: `2818040276`
- Binary: `10100111 11110110 11100101 11010100`

### 9.2.2 Delimiter

Every header ends with a 2-byte delimiter at offset 126:

```text
Offset 126: 0xA6 0xE5
```

### 9.2.3 Quick Identification

To quickly identify a Cryptdatum file:

1. Read first 4 bytes
2. Compare to magic bytes `0xA7F6E5D4`
3. Optionally verify delimiter at offset 126-127

## 9.3 File Extensions

### 9.3.1 Primary Extension

The official file extension is:

```text
.cdatum
```

### 9.3.2 Alternative Extensions

Implementations are free to use alternative extensions for specific use cases:

| Extension | Example Use Case |
|-----------|------------------|
| `.cdatum` | Standard Cryptdatum container |
| `.cdatumx` | Encrypted Cryptdatum container |
| `.cdatums` | Signed Cryptdatum container |
| `.cdatumz` | Compressed Cryptdatum container |

### 9.3.3 Compound Extensions

Compound extensions may be used for clarity:

- `.tar.cdatum` - TAR archive in Cryptdatum container
- `.json.cdatum` - JSON data in Cryptdatum container
- `.log.cdatum` - Log file in Cryptdatum container

## 9.4 MIME Types

### 9.4.1 Standard MIME Types

```text
application/x-cryptdatum    (experimental/unregistered)
application/cryptdatum      (for registered use)
```

### 9.4.2 Variant MIME Types

| MIME Type | Description |
|-----------|-------------|
| `application/x-cryptdatum` | Generic Cryptdatum container |
| `application/x-cryptdatum+json` | Cryptdatum with JSON payload |
| `application/x-cryptdatum+cbor` | Cryptdatum with CBOR payload |
| `application/x-cryptdatum+msgpack` | Cryptdatum with MessagePack payload |

### 9.4.3 MIME Type Parameters

Optional parameters:

- `version`: Format version (e.g., `version=1.0.0`)
- `compressed`: Compression algorithm if known
- `encrypted`: Encryption algorithm if known

Example:

```text
Content-Type: application/x-cryptdatum; version=1.0.0; encrypted=aes256gcm
```

## 9.5 Format Detection Heuristics

### 9.5.1 Minimum Container Size

A valid Cryptdatum container must be at least 128 bytes (header size).

### 9.5.2 Version Validation

After magic byte verification:

1. Read VERSION field (offset 4-9)
2. Verify major version > 0
3. Check reasonable version numbers (e.g., major < 100)

### 9.5.3 Timestamp Validation

The TIMESTAMP field (offset 10-17) must be:

- Greater than 1652155382000000001 (the magic date)
- Less than a reasonable future date
- Valid Unix nanosecond timestamp

### 9.5.4 Flags Validation

The FLAGS field (offset 18-25) must be:

- Non-zero (minimum value is 1)
- Have valid flag combinations (see Section 3)

## 9.6 Implementation Guidelines

### 9.6.1 File Type Detection Libraries

For integration with file type detection systems:

```c
// Example magic number entry for file(1) command
0    belong    0xA7F6E5D4    Cryptdatum container
>4   leshort   x             \b, version %d
>6   leshort   x             \b.%d
>8   leshort   x             \b.%d
```

### 9.6.2 Registry Entries

For operating system registration:

- **UTI (macOS)**: `org.cryptdatum.container`
- **Windows Registry**: Associate `.cdatum` with application
- **Linux Desktop**: Add entry to `/usr/share/mime/packages/`

### 9.6.3 Validation Depth

Different validation levels for different contexts:

1. **Quick Check**: Magic bytes only (4 bytes)
2. **Basic Validation**: Magic + delimiter + version check
3. **Full Validation**: Complete header validation including checksums

## 9.7 Security Considerations

### 9.7.1 False Positives

The 4-byte magic number has a 1 in 2^32 chance of random occurrence. For security-critical applications:

- Verify the delimiter as well
- Check version field validity
- Validate the complete header structure

### 9.7.2 Polyglot Files

Be aware that files can be crafted to be valid in multiple formats. Always:

- Validate beyond just magic bytes
- Consider the source and context
- Use full validation for untrusted sources

### 9.7.3 Format Confusion

Prevent format confusion attacks:

- Don't rely solely on file extensions
- Always verify magic bytes
- Validate internal structure consistency
