# ADR-0002: Event-Driven Core

- Status: Accepted
- Date: 2026-07-30

## Context

Large Vaults should not require a complete rescan after every file edit.

## Decision

The initial index is built with a full scan. Later file changes update only the affected record.
Core services communicate through typed events where loose coupling is useful.

## Consequences

- Incremental updates are efficient.
- Event contracts require tests and version discipline.
- Consumers must tolerate asynchronous event handling.
