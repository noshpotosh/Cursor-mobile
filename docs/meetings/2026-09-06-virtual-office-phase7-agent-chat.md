# Meeting — Virtual office Phase 7 agent Teams chat

**Date:** 2026-09-06  
**Present:** Fabrizio (coord), Dex (build)  
**Depends on:** Phase 6 merged (#14)

## Shipped

Teams talks to the agent personas (local bus; live Cursor delivery later):

- `office/data/agent-personas.json` voice packs per staff id
- `agentBus.js` + `personaReply.js` — threads, keyword replies, delay
- Teams UI paints persisted threads + typing cue
- `localStorage` key `warewolf-office-agent-chat-v1`
- Provider seam (`describeAgentProvider`) for a future remote Cursor backend
- New goal: “Ping the pack”

## Honest limit

Still a **static** loft — no server — so replies are local persona packs, not live Cursor agent runs. The bus is the swap point when a backend exists.

## How to view

```bash
cd office && python3 -m http.server 8765
```

Desk PC → Teams → pick Fabrizio/Maeve/Dex/Cal/Reed → send a message.

## Next

Phase 8: remote Cursor agent delivery behind the provider seam, or richer loft life (coffee / whiteboard).
