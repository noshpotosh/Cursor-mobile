# ADR 001 — Virtual office product scope

**Status:** Locked  
**Date:** 2026-09-05  
**Deciders:** Nosh + Fabrizio Cortell

## Decision

Build an internal **Warewolf Virtual Office** as a **static vanilla HTML** app under [`office/`](../../office/). No framework, no bundler required for day-one play.

### Locked choices

| Topic | Call |
| --- | --- |
| Player avatar | **Nosh** |
| Starter staff | Fabrizio, Maeve, Dex, Cal, Reed (+ Nosh = 6 desks) |
| Art | Isometric pixel, cozy living office |
| Economy | **Company bucks** earned by completing **team goals/deadlines** |
| Desk PC | Opens a **fake desktop OS** |
| Launch apps | **Teams** + **Employee Directory** only |
| Agent chat | Local persona message bus in Teams; **live Cursor delivery later** |
| Persistence | `localStorage` for bucks/goals/office state |
| Quality bar | Production-quality internal tool; no corner-cutting |

### Staff data contract (shared)

Floor NPCs and Employee Directory share one source of truth (later: `office/data/staff.json`):

- `id`, `displayName`, `role`, `about`, `avatarAsset`, `deskId`
- Presence is derived from desk occupancy (Available / Away), not stored as a separate manual flag for v1

### Non-goals (for now)

- React/Vue/Svelte / bundler-required app
- Real Cursor agent message delivery (local persona bus is in; remote later)
- Extra desktop apps beyond Teams + Directory
- Multiplayer / accounts / server
- Full HR needs/hunger sim

## Consequences

- Phase 0 locks art + scope before movement code
- Maeve owns visual feel; Dex implements tiny slices; Cal breaks flows; Reed gates readability
- Office doctrine lives under `docs/office/`; one link from root README when the shell exists
