// Named constants for the isometric starter loft renderer.

export const TILE_WIDTH_PX = 64;
export const TILE_HEIGHT_PX = 32;

export const CANVAS_WIDTH_PX = 960;
export const CANVAS_HEIGHT_PX = 640;

// Kept as fallbacks; the shell now sizes to the viewport.

export const FloorTileKind = {
  CARPET: "carpet",
  WOOD: "wood",
};

export const FurnitureKind = {
  DESK: "desk",
  BUBBLER: "bubbler",
};

export const FloorFill = {
  [FloorTileKind.CARPET]: "#c9b8a6",
  [FloorTileKind.WOOD]: "#8b6914",
};

export const FurnitureFill = {
  [FurnitureKind.DESK]: "#c4a484",
  [FurnitureKind.BUBBLER]: "#6b8f71",
};

export const PLAYER_DESK_ACCENT = "#d97706";
export const INK = "#1a1714";
export const BONE = "#f4efe6";
export const CHAIR_FILL = "#7a5c45";
export const SCREEN_FILL = "#86efac";

export const PLAYER_STAFF_ID = "nosh";
export const PLAYER_DESK_ID = "desk-nosh";

// Click-to-walk feel: brisk office stride, not a sprint.
export const PLAYER_MOVE_TILES_PER_SECOND = 3.25;

export const PLAYER_JACKET_FILL = PLAYER_DESK_ACCENT;
export const PLAYER_SKIN_FILL = "#e8c4a8";
export const PLAYER_PANTS_FILL = "#3d4f5f";
export const PLAYER_HAIR_FILL = "#2c1810";
export const PLAYER_SHOE_FILL = "#1a1714";

export const PATH_TARGET_FILL = "rgba(217, 119, 6, 0.5)";
export const PATH_TARGET_STROKE = "#b45309";

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
  USE_PC: "use-pc",
};

export const NPC_SKIN_FILL = "#e8c4a8";
export const NPC_PANTS_FILL = "#3d4f5f";
export const NPC_HAIR_FILL = "#2c1810";
export const NPC_SHOE_FILL = "#1a1714";

// Distinct jackets so staff read apart from amber Nosh.
export const NpcJacketFill = {
  "fabrizio-cortell": "#3d5a6c",
  "maeve-quinn": "#a85d4f",
  "dex-harlan": "#2f6f5e",
  "cal-rook": "#8b3a3a",
  "reed-mallory": "#4a5560",
};

export const DEFAULT_NPC_JACKET_FILL = "#5c6b73";

export const BUBBLER_DRINK_LINE =
  "Cold water. Pack hydrated.";

// Short floor lines — real agent chat comes later.
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

export const DesktopAppId = {
  TEAMS: "teams",
  DIRECTORY: "directory",
  GOALS: "goals",
  LOFT: "loft",
};

export const UpgradeId = {
  DESK_PLANTS: "desk-plants",
  BETTER_CHAIRS: "better-chairs",
  AMBER_NEON: "amber-neon",
};

export const BETTER_CHAIR_FILL = "#5c4033";
export const PLANT_POT_FILL = "#8b6914";
export const PLANT_LEAF_FILL = "#6b8f71";
export const NEON_SIGN_FILL = "#d97706";


export const PresenceStatus = {
  AVAILABLE: "Available",
  AWAY: "Away",
};

// Stub Teams replies until real agent chat is wired.
export const StaffTeamsStubLine = {
  "fabrizio-cortell":
    "Loop me before we widen scope.",
  "maeve-quinn":
    "Send the mock. I'll cut the vanity.",
  "dex-harlan":
    "PR link when it's readable.",
  "cal-rook":
    "I'll try to break it after lunch.",
  "reed-mallory":
    "Paste the diff. I'll red-pen it.",
  nosh: "Notes to self land here later.",
};

export const ECONOMY_STORAGE_KEY = "warewolf-office-economy-v1";
export const STARTING_COMPANY_BUCKS = 0;
