# ADR 002 — Docs home (no README sprawl)

**Status:** Locked  
**Date:** 2026-09-05  
**Deciders:** User + Fabrizio Cortell

## Decision

All lasting writing that isn't the root front door lives under **`docs/`**:

- Doctrine: `culture.md`, `coding-standards.md`, `brand.md`
- `docs/meetings/` — conversation / meeting summaries
- `docs/decisions/` — locked calls (ADRs-lite)
- `docs/index.md` — the only map

Root keeps a single **`README.md`**.

## Why

We're going to save meetings and decisions. Without a home, that becomes a fuck-ton of READMEs and orphan markdown at the repo root.

## Consequences

- Don't add `README.md` to every subfolder
- Prefer editing doctrine over creating twin files
- New meeting → `docs/meetings/YYYY-MM-DD-short-slug.md`
- New lock → `docs/decisions/NNN-short-slug.md`
