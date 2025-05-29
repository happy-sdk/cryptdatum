# Specification Versioning

## Statuses & Versioning

The Cryptdatum specification follows a clear lifecycle and versioning policy to ensure transparency, stability, and ease of contribution. This guide explains how new versions are proposed, reviewed, and released.

### Statuses

| Status                | Description                                                                                  | Typical Version Tag         |
| --------------------- | -------------------------------------------------------------------------------------------- | --------------------------- |
| **Draft**             | Early, internal, unstable—work in progress, not for public review.                           | `1.x.0-alpha`               |
| **Public Draft**      | Open for proposals and public contributions; under active development and subject to change. | `1.x.0-beta`                |
| **Candidate Release** | Ready for final review/testing, only critical fixes expected.                                | `1.x.0-rc`                  |
| **Stable**            | Finalized, ready for production use.                                                         | `1.x.0`, `2.0.0`, etc.      |
| **Deprecated**        | No longer recommended, a newer version or alternative exists.                                | `1.x.0` (marked deprecated) |
| **Obsolete**          | Superseded and no longer maintained.                                                         | `1.x.0` (archived)          |
| **Withdrawn**         | Abandoned, will not be developed further.                                                    | `1.x.0` (archived)          |

### Versioning Policy

- **Semantic Versioning (SemVer)** is used: `MAJOR.MINOR.PATCH`
  - **MAJOR**: Breaking changes (e.g., `2.0.0`)
  - **MINOR**: Backwards-compatible additions (e.g., `1.1.0`)
  - **PATCH**: Backwards-compatible bug fixes or clarifications (e.g., `1.0.1`)
- **Pre-release tags**:
  - `-alpha.N`: Early draft, unstable, breaking changes likely.
  - `-beta.N`: Feature-complete, feedback wanted, may still change.
  - `-rc.N`: Release candidate, only critical fixes expected.

### How Future Versions Are Proposed and Managed

1. **Proposing a Change**  
   All changes start as a **Draft** (e.g., `1.1.0-alpha.1`). Drafts initialize structure for new specification version.

2. **Proposing a Change**  
   Primary development phase **Public Draft** (e.g., `1.1.0-beta.1`). Drafts are open for community feedback and iteration.

3. **Advancing to Candidate Release**  
   Once feature-complete and reviewed, a draft becomes a **Candidate Release** (e.g., `1.1.0-rc.1`). Candidate releases are for final testing and feedback.

4. **Releasing as Stable**  
   After successful review and testing, the spec is released as **Stable** (e.g., `1.1.0` or `2.0.0` for breaking changes).

5. **Deprecation and Obsolescence**  
   When a new stable version supersedes an old one, the old version is marked **Deprecated**. Deprecated versions may eventually become **Obsolete** and archived.

6. **Withdrawn**  
   If a draft or candidate is abandoned, it is marked **Withdrawn**.

### Example Version Progression

- `1.1.0-alpha.1` → `1.1.0-beta.1` → `1.1.0-rc.1` → `1.1.0`
- `2.0.0-alpha.1` (for breaking changes) → ... → `2.0.0`
