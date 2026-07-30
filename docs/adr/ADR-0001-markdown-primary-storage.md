# ADR-0001: Markdown as Primary Storage

- Status: Accepted
- Date: 2026-07-30

## Context

Engineering data must remain readable, portable and versionable without Engineering Suite.

## Decision

Markdown files with YAML frontmatter are the authoritative storage format.
The in-memory engineering database is derived data and may always be rebuilt.

## Consequences

- Project data remains Git-friendly and tool-independent.
- Parsing and schema validation are required.
- Database performance optimizations may never become the only copy of project data.
