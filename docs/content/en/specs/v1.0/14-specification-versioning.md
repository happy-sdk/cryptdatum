# Specification Versioning

The Cryptdatum specification adopts a simplified versioning system that uses only MAJOR and MINOR version components. This approach ensures clarity in the evolution of the format and helps maintain backward compatibility.

::: tip Versioning System
- **MAJOR Version**:
    - Indicates substantial changes, potentially backward-incompatible.
    - Signifies a significant evolution in the format.

- **MINOR Version**:
    - Denotes minor improvements, additions, or changes that are backward-compatible.
    - Allows for incremental updates without disrupting existing implementations.
:::

## Mapping to MAJOR.MINOR

- Each `VERSION ` maps directly to a specific MAJOR.MINOR combination. This mapping is critical for understanding the capabilities and compatibility of different versions.
- The MAJOR version increment signals substantial changes, potentially backward-incompatible. It indicates a significant evolution in the format.
- The MINOR version increment denotes minor improvements, additions, or changes that are backward-compatible.

## Incrementing VERSION

- The `VERSION ID` increments sequentially with each new version of the specification.
- The minimum value for `VERSION ID` is 1, representing the initial release of the specification.
- `VERSION ID` must never be zero. It should always represent a valid version of the specification.

## Version History Documentation

- A comprehensive version history should be maintained in the specification documentation, detailing what changes each `VERSION ID` corresponds to in terms of MAJOR.MINOR.
- This documentation helps implementers understand the evolution of the format and manage compatibility.

### Handling Backward Compatibility

- Changes in the MAJOR version component should be scrutinized for backward compatibility impacts.
- Implementers are encouraged to support backward compatibility where feasible, especially for minor version updates.

### Implementation Considerations

- Implementers should design their systems to easily adapt to version increments, particularly minor version changes.
- Systems should be capable of identifying the `VERSION` and understanding the corresponding capabilities and requirements of that version.

### Future Proofing

- The `VERSION`’s 16-bit range offers ample space for future versions. However, thoughtful planning of version increments ensures the longevity and relevance of the format.

By adopting this simplified versioning system, the Cryptdatum specification ensures a clear and manageable evolution path, facilitating long-term compatibility and ease of implementation.
