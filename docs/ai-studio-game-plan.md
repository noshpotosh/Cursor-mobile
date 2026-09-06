# Warewolf AI studio game plan

**Status:** Proposed implementation plan

**Date:** 2026-09-06

**Planning owner:** Fabrizio Cortell

**Product owner:** Maeve Quinn

**Product thesis:** [ADR 007][product-thesis]

[product-thesis]: decisions/007-honest-ai-studio-tycoon.md

## Verdict

**Reshape it, then ship the smallest honest version.**

The founder-management fantasy has teeth: players invent software companies,
choose their own projects, hire a small crew, dispatch AI agents, and make
release decisions from evidence.

The dangerous part is Warewolf keeping the generated source. That creates
intellectual-property, security, storage, and trust liability without making
the game better.

The recommended promise is:

> Agents build software inside disposable sandboxes. Players receive verified
> build state, consequences, and rewards. The generated source is deleted,
> not delivered or warehoused.

This is a game about running a software studio. It is not a coding service, and
we must say that plainly anywhere the game is described or sold.

## Product in one sentence

A cozy isometric pixel-art founder sim where players invent software
companies, manage a small AI workforce, and make release decisions from
verifiable build state instead of receiving source code.

## The hook

The office is not decoration around a chatbot. It is a readable physical model
of work:

- Who is assigned
- What is in progress
- What is blocked
- How confident the build is
- What tradeoff the founder makes next

Working agents sit at active monitors. Blocked agents move to the whiteboard.
Failed builds bring the verifier over. Shipped milestones appear on the Weekly
Wins board. If state only exists in menus, the loft becomes expensive
wallpaper.

## Smallest honest game

The first playable version contains:

- One cozy isometric office
- One customizable company and founder
- One software project with three milestones
- Three hireable employee archetypes
- Hiring, firing, salaries, assignments, and morale
- One deterministic fake-agent provider
- Planning, working, blocked, failed, testing, and released states
- Company Bucks funding the four existing decor upgrades
- Personalized crew reactions with deterministic fallback dialogue
- Versioned local save and resume

The first version does **not** need live AI. It needs to prove that managing the
work is understandable and fun.

## Core gameplay loop

### 1. Choose the bet

The player starts from a project template or writes a free-form pitch. The
game turns that pitch into a brief with goals and milestones. The player edits
and approves the plan before work begins.

### 2. Staff the work

The player hires a small team, matches roles and traits to milestones, sets a
budget, and accepts tradeoffs between speed, cost, and confidence.

### 3. Dispatch agents

Agents visibly move through planning, implementation, tests, and review. The
office changes while work is active.

### 4. Read the evidence

The player receives:

- Build status
- Passing and failing check counts
- Named blocker categories
- Cost and elapsed game time
- A short sanitized summary
- A personalized crew response

The player does not receive source code.

### 5. Intervene

The player may:

- Rewrite a milestone
- Cut scope
- Add or replace a specialist
- Spend time testing
- Retry failed work
- Cancel the project
- Release with known risk

### 6. Grow the studio

Successful decisions earn Company Bucks, unlock more difficult project types,
expand the employee pool, and improve the office.

Keep one spendable currency in the first version. Reputation may unlock
content, but it should not become another wallet.

## Three gameplay clocks

### Minute loop

Walk, inspect, assign, test, collect, and react to one event.

### Session loop

Move one project from idea to released, failed, or deliberately cut.

### Career loop

Unlock stronger staff, harder project types, and better offices.

## Customization boundary

"Customize everything" is an attractive sentence and an infinite scope trap.

The first version should support:

- Free-form company name, project title, and project pitch
- A bounded founder appearance set
- Bounded employee roles and traits
- Editable goals and milestones
- Office layout and decor choices
- Project templates that AI can adapt

The first version should not generate arbitrary gameplay systems, art,
employees, or toolchains. Broader generation comes after the fixed loop works.

## Staff management

Each employee needs only enough state to produce real decisions:

- Role
- Salary
- Reliability
- Morale
- Current assignment
- Availability

Avoid hunger, hygiene, detailed schedules, and other life-sim machinery. Those
systems add upkeep before they add strategy.

The Warewolf crew should remain the cast of the internal build. A public build
should use fictional role archetypes unless the crew deliberately becomes part
of the public product brand.

## Project state

A project moves through these states:

1. Idea
2. Planned
3. In progress
4. Verification
5. Released, failed, paused, or cancelled

An individual task moves through:

1. Queued
2. Planning
3. Implementing
4. Testing
5. Reviewing
6. Passed, blocked, or failed

Every transition must have a visible cause. Random failure without an
understandable reason is not strategy.

## Godot implementation direction

The recommended engine path is Godot 4.7.2 stable with GDScript. ADR 007 does
not lock an engine or authorize a build; P0 must lock that call first.

Start desktop-first at 1280x720. Make click and tap share the same interaction
path, and keep management controls touch-safe. Do not commit to phone layouts
until the text-heavy management loop has been proven on desktop.

### Scene shape

```text
Main
  World / IsometricOffice
    FloorLayer / TileMapLayer
    FurnitureLayer / TileMapLayer and props
    Actors / Node2D with y-sorting
    InteractionMarkers / Node2D
  Hud / CanvasLayer
  Desktop / Control
```

### Autoload services

- `GameState` owns projects, staff, economy, and progression
- `SaveStore` owns versioned local persistence
- `TaskProvider` exposes the local simulator or remote game API
- `EventBus` carries explicit domain signals
- `ContentCatalog` loads and validates staff and project data

### Pathfinding

Use `AStarGrid2D` over a logical occupancy map for the first loft. The rooms are
small fixed grids, and the existing web prototype already proves that model.

Do not couple actor movement to `TileMapLayer` navigation. Godot documents
practical limitations in TileMap navigation, and a baked navigation mesh is
unnecessary until layouts become irregular or substantially larger.

### Art and UI

Carry forward the existing contracts:

- Classic 2:1 isometric projection
- 64x32 logical tiles
- Characters approximately 48 to 64 pixels tall
- Nearest-neighbor texture filtering
- Warm bone, clay, amber, sage, and ink palette
- Pixel art for the world
- Normal readable text controls for management UI

Reference mocks remain references. Accepted runtime sprites may be migrated
into the Godot project with their provenance intact.

## Live-agent boundary

The Godot client must never contain provider credentials or execute generated
code.

```text
Godot client
  -> Game API and task orchestrator
  -> Disposable execution worker
  -> Structured evidence response
  -> Game-state update
```

### Godot client

Owns the office, management UI, local save, and deterministic simulator.

### Game API and orchestrator

Validates briefs, enforces cost and time budgets, owns authoritative task
state, and emits state transitions.

### Disposable execution worker

Builds one greenfield task inside an isolated workspace, runs approved checks,
returns a structured result, and deletes the workspace after completion or
expiry.

Network access should be denied by default. User repositories, secrets,
deployments, and third-party accounts are outside the first version.

### Retained evidence

The recommended retained state is:

- User-approved brief and milestones
- Task-state transitions
- Passing and failing check counts
- Sanitized blocker and outcome summaries
- Agent cost and elapsed time
- Reward and progression events

Do not retain generated source or raw secrets.

## Personalized responses

Responses should be grounded in actual state, short, and replaceable with a
deterministic fallback.

Inputs may include:

- Employee persona
- Task outcome
- Known blocker
- Player intervention
- Project history

Generated text must never decide whether a task passed. Verification state
comes from structured checks, not narration.

## PR-sized roadmap

Each phase is one concern and lands through its own branch and PR.

### P0 - Lock the product contract

Define the player promise, source-deletion policy, retained evidence, target
platform, supported first project type, and maximum live-agent cost.

**Proof:** a locked decision removes the open product and trust questions.

**Owners:** Nosh and Fabrizio

### P1 - Build the Godot office vertical slice

Create the Godot project and migrate only the art needed for one existing loft.
Add crisp rendering, click or tap movement, y-sorting, one desk, and one
interaction.

**Proof:** the full room loads at 1280x720 and the player can reach and use the
desk without visual or pathing errors.

**Sequence:** Maeve shapes, Dex builds, Cal verifies, Reed checks readability.

### P2 - Add the local management loop

Add one project, three milestones, a small employee roster, hire and fire,
assignments, economy, save, and resume.

**Proof:** a fresh player can create a project, staff it, save, and continue it.

**Sequence:** Maeve shapes, Dex builds, Cal verifies.

### P3 - Add the deterministic dispatch simulator

Implement a local `TaskProvider` that produces queued, working, blocked,
failed, and passed outcomes from readable rules.

**Proof:** every outcome has a reproducible cause and updates the office and
management UI consistently.

**Sequence:** Dex builds, Cal verifies, Reed checks readability.

### P4 - Add testing and release decisions

Let players investigate a failure, reroute work, retry, cut scope, and release
or cancel with known consequences.

**Proof:** playtesting shows that players understand why work failed and want
to begin another project without live AI.

**Sequence:** Maeve shapes, Dex builds, Cal verifies.

### P5 - Spike one disposable live-agent task

Add a provider-neutral backend path for one greenfield project type with one
explicit test command.

**Proof:** the worker runs in isolation, returns structured evidence, respects
its budget, and deletes generated source.

**Sequence:** Dex builds, Cal performs the security and failure-path review.

### P6 - Add personalized consequences

Generate bounded crew reactions and rewards from verified task state.

**Proof:** responses remain grounded, short, safe, cached, and replaceable by
fallback text.

**Sequence:** Maeve shapes, Dex builds, Cal verifies.

### P7 - Expand progression and harden mobile behavior

Add more projects, employees, and upgrades only after the core loop works.
Verify touch targets, interruption recovery, offline behavior, and device
performance.

**Proof:** additional content deepens the proven loop without creating another
management system.

**Sequence:** Maeve shapes, Dex builds, Cal verifies, Reed gates readability.

## Hard gate before live AI

Do not begin P5 until P2 through P4 prove that the management loop is fun and
legible with the deterministic simulator.

AI cannot rescue a boring loop. Starting with live execution would make every
design mistake slower and more expensive to diagnose.

## Success checks for the vertical slice

- A new player dispatches the first task within three minutes
- The player can explain why a task passed, failed, or became blocked
- The player makes at least one meaningful staffing or scope tradeoff
- A complete project session fits within roughly ten minutes
- The player understands that no source code will be delivered
- The game remains fun when every result comes from the local simulator
- The office visibly reflects current work without requiring a menu

These are playtest targets, not invented launch metrics. Real thresholds should
be locked after observing the first playable build.

## Explicit non-goals for the first version

- Importing user repositories
- Handling user secrets or credentials
- Deploying real software
- Connecting third-party accounts
- Multiplayer or shared companies
- Fully generated art or employees
- Multiple spendable currencies
- Detailed employee life simulation
- Arbitrary programming languages and toolchains
- Mobile store launch before desktop validation

## Founder decisions still required

1. Desktop-first, mobile-first, or desktop with touch-safe UI
2. Warewolf crew as public cast or internal demo cast only
3. Immediate source deletion or a short retry window
4. First supported project type
5. Maximum live-agent cost per player session
6. Exact retained evidence: counts, sanitized logs, or named checks

Recommended defaults are desktop-first with touch-safe UI, internal Warewolf
cast, immediate source deletion, greenfield web-app projects, a hard per-session
cost ceiling, and retained structured summaries without raw source.

## Next move

Lock P0 as a dedicated decision before creating the Godot project. Then Maeve
defines the vertical-slice experience and asset cut before Dex begins P1.
