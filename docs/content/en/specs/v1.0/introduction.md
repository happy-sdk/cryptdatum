# Cryptdatum Data Format Specification 

> Public Working Draft and prototype.

**Version** <Badge type="tip" text="v1.0" />

---


| | |
| --------------------- | ------------ |
| **Date:**             | *10.5.2022*  |
| **Updated:**          | *7.7.2024*  |
| **Version:**          | *1.0*        |
| **Version ID:**       | *1*          |

<script setup>
import {
  VPTeamPageTitle,
  VPTeamMembers,
} from 'vitepress/theme'

const members = [
  {
    avatar: 'https://www.github.com/mkungla.png',
    name: 'Marko Kungla',
    title: 'Author',
    links: [
      { icon: 'github', link: 'https://github.com/mkungla' },
      { icon: 'twitter', link: 'https://twitter.com/markokungla' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/kungla/' },
    ]
  },
]
</script>

## Introduction

The Cryptdatum format is a powerful, flexible universal data format for storing data in a long-term compatible way across domains and with any encryption and compression algorithms. It consists of a 64-byte header that stores information about the data payload, followed by the data payload or 64-byte header followed by the optional metadata, signature, chunk table, and then data payload. Cryptdatum is designed to be flexible enough to accommodate a variety of use cases, while still maintaining simplicity. Usage of all features used in the data can be determined by reading setting from different header flags and accompanying header fields. e.g. some of the following;

- If Metadata flag bit *DATUM METADATA (1024)* is set *METADATA SPEC* and *METADATA SIZE* field values can be used by decoder to determine how to parse metadata from the beginning of the payload.
- If *CHUNKK SIZE* field is greater than 0 and *DATUM CHUNKED (512)* flag bit is set then data can be streamed and processed in chunks
- if Compression flag bit *DATUM COMPRESSED (32)* is set then *COMPRESSION ALGORITHM* header field represents Compression Algorithm used so that decoder can decide how to decompress the data.
- If Encryption flag bit *DATUM ENCRYPTED (64)* is set then *ENCRYPTION ALGORITHM* header field represents Encryption Algorithm used so that decoder can decide how to decrypt the data.

Cryptdatum can be used to store and transmit data fast. The format includes a number of features to ensure the security and integrity of the data, including built-in checksumming, optional encryption, compression, signing, and metadatum API's.

Cryptdatum is an ideal data format for both centralized and decentralized environments, as it is flexible enough to be used for simple, common local data container or as a means of data storage and transfer in distributed systems and even blockchain technologies. The 64 byte header and flexible metadata specification provide an API on steroids, and it's even suitable for use as a universal metaverse data container. Imagine being able to store and share all your virtual world assets and experiences in one, secure format across all blockchain networks which have adopted this specification. The possibilities are endless.

## Data Format Specification

::: warning Note
The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC-2119](https://www.rfc-editor.org/rfc/rfc2119).
:::

## Authors

<VPTeamMembers size="small" :members="members" />
