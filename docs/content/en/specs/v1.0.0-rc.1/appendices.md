# Appendices

## Appendix A: Size Calculations

### A.1 Maximum Size Limits

#### A.1.1 64-bit Size Field

When using only the `size_lo` field (uint64):

```text
Maximum size = 2^64 - 1 bytes
             = 18,446,744,073,709,551,615 bytes
             ≈ 18.4 exabytes
```

#### A.1.2 128-bit Size Field

When using both `size_lo` and `size_hi` fields (uint128):

```text
Maximum size = 2^128 - 1 bytes
             = 340,282,366,920,938,463,463,374,607,431,768,211,455 bytes
```

### A.2 Chunk Size Recommendations

#### A.2.1 Recommended Chunk Sizes

| Payload Size | Chunk Size | Chunk Count |
|-------------|------------|-------------|
| ≤ 1 TB      | 4 MiB      | ≤ 262,144   |
| ≤ 1 PB      | 16 MiB     | ≤ 65,536    |
| ≤ 1 EB      | 64 MiB     | ≤ 16,777,216|

#### A.2.2 Minimum Chunk Size Calculation

For a given payload size, the minimum chunk size to stay within the maximum chunk count (2^64) is:

```text
minimum_chunk_size = ceil(payload_size / 2^64)
```

Example: For a 394 ZB payload:

```text
minimum_chunk_size = ceil(394 × 10^21 / 2^64)
                  ≈ 21.1 GB
```

## Appendix B: Stream Schema Examples

### B.1 Live Video Streaming

#### B.1.1 Initial Container

```text
Header:
  - DATUM_METADATA flag: 1
  - METADATA_SPEC: 0x0000000000000012 (Stream Schema)

Metadata:
  - stream_id: [16 bytes] Unique stream identifier
  - sequence: 0 (uint64)
  - fragment_size: [uint64] Expected fragment size
  - total_fragments: 0 (uint64, unknown for live stream)
  - flags: 0x0001 (uint16, live stream indicator)
```

#### B.1.2 Fragment Container

```text
Header:
  - DATUM_METADATA flag: 1
  - METADATA_SPEC: 0x0000000000000012 (Stream Schema)

Metadata:
  - stream_id: [16 bytes] Same as initial container
  - sequence: [uint64] Incrementing counter
  - fragment_size: [uint64] Same as initial container
  - total_fragments: 0 (uint64)
  - flags: 0x0000 (uint16, normal fragment)
```

#### B.1.3 Termination Container

```text
Header:
  - DATUM_METADATA flag: 1
  - METADATA_SPEC: 0x0000000000000012 (Stream Schema)

Metadata:
  - stream_id: [16 bytes] Same as initial container
  - sequence: [uint64] Final sequence number
  - fragment_size: [uint64] Actual size of final fragment
  - total_fragments: [uint64] Total number of fragments
  - flags: 0x0002 (uint16, end of stream indicator)
```

### B.2 Sensor Data Collection

#### B.2.1 Sensor Container

```text
Header:
  - DATUM_METADATA flag: 1
  - METADATA_SPEC: 0x0000000000000012 (Stream Schema)

Metadata:
  - stream_id: [16 bytes] Sensor identifier
  - sequence: [uint64] Reading sequence number
  - fragment_size: [uint64] Fixed batch size
  - total_fragments: [uint64] Optional total count
  - flags: [uint16] Sensor status and data quality indicators
```

#### B.2.2 Flag Definitions

| Bit | Description |
|-----|-------------|
| 0   | Data quality indicator |
| 1   | Sensor status indicator |
| 2-15| Reserved for future use |
