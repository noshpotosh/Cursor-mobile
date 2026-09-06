export const TILE_WIDTH_PX = 128;
export const TILE_HEIGHT_PX = 64;

export const FurnitureKind = {
  DESK: "desk",
  BUBBLER: "bubbler",
  COFFEE: "coffee",
  WHITEBOARD: "whiteboard",
};

export const PLAYER_STAFF_ID = "nosh";
export const PLAYER_DESK_ID = "desk-nosh";

// Click-to-walk feel: brisk office stride, not a sprint.
export const PLAYER_MOVE_TILES_PER_SECOND = 3.25;
export const PLAYER_WALK_BOB_RATE = 10;

export const CARDINAL_STEPS = [
  { deltaX: 1, deltaY: 0 },
  { deltaX: -1, deltaY: 0 },
  { deltaX: 0, deltaY: 1 },
  { deltaX: 0, deltaY: -1 },
];

// Prefer standing just south of Nosh's desk when the loft loads.
export const SPAWN_SEARCH_OFFSETS = [
  { deltaX: 0, deltaY: 1 },
  { deltaX: 1, deltaY: 0 },
  { deltaX: -1, deltaY: 0 },
  { deltaX: 0, deltaY: -1 },
  { deltaX: 1, deltaY: 1 },
  { deltaX: -1, deltaY: 1 },
  { deltaX: 1, deltaY: -1 },
  { deltaX: -1, deltaY: -1 },
];

// Chebyshev distance: orthogonal + diagonal neighbors count.
export const INTERACT_RANGE_TILES = 1;

export const InteractKind = {
  TALK: "talk",
  DRINK: "drink",
  SIP_COFFEE: "sip-coffee",
  READ_BOARD: "read-board",
  USE_PC: "use-pc",
};

// Distinct jackets so staff read apart from amber Nosh.
export const NpcJacketFill = {
  "fabrizio-cortell": "#3d5a6c",
  "maeve-quinn": "#6b8057",
  "dex-harlan": "#2f6f5e",
  "cal-rook": "#8b3a3a",
  "reed-mallory": "#4a5560",
};

export const DEFAULT_NPC_JACKET_FILL = "#5c6b73";

export const BUBBLER_DRINK_LINE =
  "Cold water. Pack hydrated.";

export const COFFEE_SIP_LINE =
  "Hot brew. Pack caffeinated.";

// Rotating scribbles on the loft whiteboard.
export const WHITEBOARD_NOTES = [
  "Ship the smallest honest slice.",
  "Brand first. One job per viewport.",
  "Readable beats clever.",
  "Prove it — vibes don't merge.",
  "Name the thing. No mystery mush.",
];

export const StaffTalkLine = {
  "fabrizio-cortell":
    "Scope first. Then we ship. Keep it 100.",
  "maeve-quinn":
    "If the first viewport could be another brand, cut it.",
  "dex-harlan":
    "Readable beats clever. Show me the recipe.",
  "cal-rook":
    "Prove it. I break builds that hide behind vibes.",
  "reed-mallory":
    "No mystery numbers. Name the thing.",
};

export const TOAST_VISIBLE_MS = 3200;
export const DESKTOP_CLOCK_INTERVAL_MS = 30000;
export const AGENT_REPLY_DELAY_MS = 450;
export const AGENT_CHAT_STORAGE_KEY =
  "warewolf-office-agent-chat-v1";

// Soft UI blips — map kind → Hz; gain/duration shared.
export const UiBlipHz = {
  MESSAGE: 660,
  DRINK: 420,
  CLICK: 520,
};
export const UI_BLIP_GAIN = 0.04;
export const UI_BLIP_DURATION_SEC = 0.12;
export const UI_BLIP_CLOSE_DELAY_MS = 200;

export const MessageRole = {
  USER: "user",
  AGENT: "agent",
  SYSTEM: "system",
};

export const DesktopAppId = {
  TEAMS: "teams",
  DIRECTORY: "directory",
  GOALS: "goals",
  LOFT: "loft",
};

// Goal ids must match office/data/goals.json.
export const GoalId = {
  SHIP_PHASE4_DESKTOP: "ship-phase4-desktop",
  TALK_TO_THREE_TEAMMATES: "talk-to-three-teammates",
  HYDRATE_ONCE: "hydrate-once",
  OPEN_DIRECTORY_PROFILE: "open-directory-profile",
  MESSAGE_TWO_AGENTS: "message-two-agents",
  SIP_OFFICE_COFFEE: "sip-office-coffee",
  READ_WHITEBOARD_NOTE: "read-whiteboard-note",
};

export const GoalEventKind = {
  OPEN_DESKTOP: "open-desktop",
  OPEN_TEAMS: "open-teams",
  OPEN_DIRECTORY: "open-directory",
  DIRECTORY_PROFILE: "directory-profile",
  TALK: "talk",
  DRINK: "drink",
  SIP_COFFEE: "sip-coffee",
  READ_BOARD: "read-board",
  AGENT_REPLY: "agent-reply",
};

export const TALK_GOAL_TARGET_COUNT = 3;
export const AGENT_REPLY_GOAL_TARGET_COUNT = 2;

export const UpgradeId = {
  DESK_PLANTS: "desk-plants",
  DESK_LAMPS: "desk-lamps",
  BETTER_CHAIRS: "better-chairs",
  AMBER_NEON: "amber-neon",
};

export const STARTER_OFFICE_ID = "starter-loft";
export const NPC_BUBBLER_VISIT_SECONDS = 18;
export const NPC_BUBBLER_DWELL_SECONDS = 2.5;
export const NPC_MOVE_TILES_PER_SECOND = 2.4;
export const NPC_VISIT_JITTER_BASE = 0.6;
export const NPC_VISIT_JITTER_SPAN = 0.8;

export const AUDIO_MUTE_STORAGE_KEY =
  "warewolf-office-audio-mute-v1";

export const PresenceStatus = {
  AVAILABLE: "Available",
  AWAY: "Away",
};

export const ECONOMY_STORAGE_KEY = "warewolf-office-economy-v1";
export const STARTING_COMPANY_BUCKS = 0;
