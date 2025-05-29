# 1. Introduction

## 1.1 Purpose

This document specifies the Cryptdatum format, a universal data container format designed for long-term data storage and interchange. The format provides a consistent structure for storing data with optional encryption, compression, digital signatures, and metadata while maintaining compatibility across different systems and applications.

## 1.2 Scope

This specification defines:

- The binary structure of Cryptdatum containers
- Required and optional features
- Algorithms and their identifiers
- Processing requirements for compliant implementations

This specification does not define:

- Network protocols for transferring Cryptdatum containers
- Specific compression, encryption, or signing algorithm implementations
- Application-specific metadata schemas beyond built-in types

## 1.3 Overview

A Cryptdatum container consists of a fixed 128-byte header followed by optional data blocks in a defined order:

```bnf
<cryptdatum> ::= <header> <checksum_block>? <metadata_block>? <signature_block>? <payload>
```

The header contains version information, feature flags, and algorithm identifiers that describe how to process the container. Optional blocks provide data integrity (checksum_block), contextual information (metadata_block), authenticity (signature_block), and the actual data (payload).

Key features include:

- **Modular design** - Enable only the features needed
- **Algorithm agnostic** - Support for multiple checksum, compression, encryption, and signing algorithms
- **Chunk support** - Efficient processing of large payloads through chunking
- **Future compatibility** - Versioned format with reserved space for extensions

## 1.4 Document Organization

This specification is organized as follows:

- **Section 2: Format Structure** - Complete definition of all data structures
- **Section 3: Feature Flags** - Registry of feature flags and their meanings
- **Sections 4-8** - Individual feature specifications (metadata, checksums, compression, encryption, signatures)
- **Section 9: Format Identification** - File extensions and MIME types
- **Section 10: Algorithm Registry** - Consolidated algorithm identifiers
- **Section 11: Security Considerations** - Security guidance (non-normative)
- **Appendices** - Examples and implementation notes (non-normative)

## 1.5 Conventions and Terminology

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119).

### 1.5.1 Terminology

- **Container**: A complete Cryptdatum data structure including header and all optional blocks
- **Block**: A discrete section of data within the container (checksum block, metadata block, etc.)
- **Chunk**: A subdivision of the payload for processing large data
- **Algorithm identifier**: A numeric value that identifies a specific algorithm

### 1.5.2 Numeric Notation

- Hexadecimal values are prefixed with `0x` (e.g., `0xA7F6E5D4`)
- Binary sizes use IEC prefixes: KiB (1024 bytes), MiB (1024 KiB), etc.
- All multi-byte numeric values use little-endian byte order unless specified otherwise
