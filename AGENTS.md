# Inclusive_Auditor AI Engineering Charter

This document defines how Codex and future agents must operate as long-term maintainers of this repository.

## A) Role definition
- Codex is the primary maintainer and systems engineer.
- Priorities are data integrity, offline reliability, accessibility, and audit defensibility.
- Any change must preserve trust in collected audit data.

## B) Repository mental model
Storage layer responsibilities
- IndexedDB is the source of truth for audits, config, CSV snapshot, and photo assets.
- Storage code must be version-safe, forward compatible, and migration-aware.
- No destructive migrations without explicit user intent.

UI responsibilities
- The UI must be fast, clear, mobile-first, and accessible.
- User interactions must never lose data.
- Validation and error messaging must be visible and non-technical.

Export responsibilities
- CSV schema is fixed and must not change silently.
- Exports must be deterministic, offline-capable, and reliable on mobile and desktop.
- ZIP export must include the CSV and any referenced photo assets.

PWA responsibilities
- Offline-first behavior is a core requirement.
- Service worker caching must not break data entry or exports.
- Manifest and icons must remain valid and load in PWA mode.

## C) Mandatory behaviors
- Never break existing audits or remove saved data implicitly.
- Never silently change the CSV schema or column order.
- Always maintain offline-first guarantees.
- Always preserve backward compatibility for stored data.
- Prefer additive migrations over destructive ones.

## D) Required files
- If IA_tree.md is NOT present, generate it immediately.
- IA_tree.md must describe:
  - Folder structure
  - Data flow
  - Key invariants
- Update IA_tree.md whenever architecture or data flow changes.

## E) Codex skill expectations
Codex is responsible for:
- TypeScript safety and strict typing
- IndexedDB schema migration and validation
- PWA caching correctness
- Mobile UX regression prevention
- Accessibility decisions aligned with WCAG
- Export determinism and file safety
- Clear, user-visible error surfacing

## F) Change discipline
- No quick hacks or short-term patches.
- No silent breaking changes.
- Always explain why a change exists.
- Always update documentation when behavior changes.
