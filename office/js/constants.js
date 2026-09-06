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
  COFFEE: "coffee",
  WHITEBOARD: "whiteboard",
};

export const FloorFill = {
  [FloorTileKind.CARPET]: "#c9b8a6",
  [FloorTileKind.WOOD]: "#8b6914",
};

export const FurnitureFill = {
  [FurnitureKind.DESK]: "#c4a484",
  [FurnitureKind.BUBBLER]: "#6b8f71",
  [FurnitureKind.COFFEE]: "#5c4033",
  [FurnitureKind.WHITEBOARD]: "#e8e2d6",
};

export const COFFEE_POT_FILL = "#3d4f5f";
export const COFFEE_BREW_FILL = "#4a2f1f";
export const WHITEBOARD_FRAME_FILL = "#7a5c45";
export const WHITEBOARD_INK_FILL = "#1a1714";

export const PLAYER_DESK_ACCENT = "#d97706";
export const INK = "#1a1714";
export const BONE = "#f4efe6";
export const CHAIR_FILL = "#7a5c45";
export const SCREEN_FILL = "#86efac";

export const PLAYER_STAFF_ID = "nosh";
export const PLAYER_DESK_ID = "desk-nosh";

// Click-to-walk feel: brisk office stride, not a sprint.
export const PLAYER_MOVE_TILES_PER_SECOND = 3.25;
export const PLAYER_WALK_BOB_RATE = 10;

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
  SIP_COFFEE: "sip-coffee",
  READ_BOARD: "read-board",
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

export const UpgradeId = {
  DESK_PLANTS: "desk-plants",
  DESK_LAMPS: "desk-lamps",
  BETTER_CHAIRS: "better-chairs",
  AMBER_NEON: "amber-neon",
};

export const BETTER_CHAIR_FILL = "#5c4033";
export const PLANT_POT_FILL = "#8b6914";
export const PLANT_LEAF_FILL = "#6b8f71";
export const NEON_SIGN_FILL = "#d97706";
export const DESK_LAMP_FILL = "#d4a017";
export const DESK_LAMP_GLOW_FILL = "rgba(255, 214, 102, 0.55)";

export const STARTER_OFFICE_ID = "starter-loft";
export const NPC_BUBBLER_VISIT_SECONDS = 18;
export const NPC_BUBBLER_DWELL_SECONDS = 2.5;
export const NPC_MOVE_TILES_PER_SECOND = 2.4;
export const NPC_VISIT_JITTER_BASE = 0.6;
export const NPC_VISIT_JITTER_SPAN = 0.8;
export const CAMERA_FOLLOW_BLEND = 0.32;
export const AUDIO_MUTE_STORAGE_KEY =
  "warewolf-office-audio-mute-v1";

export const PresenceStatus = {
  AVAILABLE: "Available",
  AWAY: "Away",
};

export const ECONOMY_STORAGE_KEY = "warewolf-office-economy-v1";
export const STARTING_COMPANY_BUCKS = 0;

// Desk-kit placeholder geometry (pre–sprite art pass).
export const DESK_TOP_HALF_WIDTH_PX = 28;
export const DESK_TOP_TOP_OFFSET_PX = 18;
export const DESK_TOP_SIDE_Y_PX = 4;
export const DESK_TOP_BOTTOM_OFFSET_PX = 10;

export const MONITOR_HALF_WIDTH_PX = 7;
export const MONITOR_WIDTH_PX = 14;
export const MONITOR_HEIGHT_PX = 10;
export const MONITOR_TOP_OFFSET_PX = 14;

export const PLAYER_ACCENT_HALF_WIDTH_PX = 10;
export const PLAYER_ACCENT_WIDTH_PX = 20;
export const PLAYER_ACCENT_HEIGHT_PX = 3;
export const PLAYER_ACCENT_Y_OFFSET_PX = 2;

export const CHAIR_HALF_WIDTH_PX = 8;
export const CHAIR_WIDTH_PX = 16;
export const CHAIR_HEIGHT_PX = 10;
export const CHAIR_Y_OFFSET_PX = 8;
export const BETTER_CHAIR_HALF_WIDTH_PX = 9;
export const BETTER_CHAIR_WIDTH_PX = 18;
export const BETTER_CHAIR_HEIGHT_PX = 14;
export const BETTER_CHAIR_Y_OFFSET_PX = 6;
export const BETTER_CHAIR_BACK_HEIGHT_PX = 5;
export const BETTER_CHAIR_BACK_Y_OFFSET_PX = 2;

export const PLANT_POT_X_OFFSET_PX = 12;
export const PLANT_POT_Y_OFFSET_PX = 8;
export const PLANT_POT_WIDTH_PX = 8;
export const PLANT_POT_HEIGHT_PX = 7;
export const PLANT_LEAF_X_OFFSET_PX = 16;
export const PLANT_LEAF_Y_OFFSET_PX = 12;
export const PLANT_LEAF_RADIUS_PX = 5;

export const LAMP_BASE_X_OFFSET_PX = 18;
export const LAMP_BASE_Y_OFFSET_PX = 8;
export const LAMP_BASE_WIDTH_PX = 5;
export const LAMP_BASE_HEIGHT_PX = 8;
export const LAMP_STEM_X_OFFSET_PX = 15;
export const LAMP_STEM_TOP_OFFSET_PX = 16;
export const LAMP_ARM_X_OFFSET_PX = 9;
export const LAMP_ARM_Y_OFFSET_PX = 14;
export const LAMP_GLOW_X_OFFSET_PX = 10;
export const LAMP_GLOW_Y_OFFSET_PX = 12;
export const LAMP_GLOW_RADIUS_PX = 5;

export const BUBBLER_HALF_WIDTH_PX = 8;
export const BUBBLER_WIDTH_PX = 16;
export const BUBBLER_HEIGHT_PX = 28;
export const BUBBLER_TOP_OFFSET_PX = 22;
export const BUBBLER_BOTTLE_Y_OFFSET_PX = 26;
export const BUBBLER_BOTTLE_RADIUS_PX = 7;

export const COFFEE_BASE_HALF_WIDTH_PX = 12;
export const COFFEE_BASE_WIDTH_PX = 24;
export const COFFEE_BASE_HEIGHT_PX = 14;
export const COFFEE_BASE_Y_OFFSET_PX = 4;
export const COFFEE_POT_HALF_WIDTH_PX = 7;
export const COFFEE_POT_WIDTH_PX = 14;
export const COFFEE_POT_HEIGHT_PX = 20;
export const COFFEE_POT_TOP_OFFSET_PX = 26;
export const COFFEE_BREW_HALF_WIDTH_PX = 5;
export const COFFEE_BREW_WIDTH_PX = 10;
export const COFFEE_BREW_HEIGHT_PX = 10;
export const COFFEE_BREW_TOP_OFFSET_PX = 20;
export const COFFEE_STEAM_BASE_Y_PX = 28;
export const COFFEE_STEAM_MID_Y_PX = 34;
export const COFFEE_STEAM_TOP_Y_PX = 38;
export const COFFEE_STEAM_X_SPREAD_PX = 6;

export const WHITEBOARD_HALF_WIDTH_PX = 18;
export const WHITEBOARD_WIDTH_PX = 36;
export const WHITEBOARD_HEIGHT_PX = 28;
export const WHITEBOARD_TOP_OFFSET_PX = 28;
export const WHITEBOARD_PAD_INSET_PX = 3;
export const WHITEBOARD_PAD_WIDTH_PX = 30;
export const WHITEBOARD_PAD_HEIGHT_PX = 22;
export const WHITEBOARD_LINE_LEFT_PX = 10;
export const WHITEBOARD_LINE_Y1_PX = 18;
export const WHITEBOARD_LINE_Y2_PX = 12;
export const WHITEBOARD_LINE_Y3_PX = 6;
export const WHITEBOARD_LINE_RIGHT_1_PX = 8;
export const WHITEBOARD_LINE_RIGHT_2_PX = 4;
export const WHITEBOARD_LINE_RIGHT_3_PX = 10;

export const CHAR_SHOE_HALF_GAP_PX = 7;
export const CHAR_SHOE_WIDTH_PX = 5;
export const CHAR_SHOE_HEIGHT_PX = 3;
export const CHAR_SHOE_INNER_X_PX = 2;
export const CHAR_PANTS_HALF_WIDTH_PX = 6;
export const CHAR_PANTS_WIDTH_PX = 12;
export const CHAR_PANTS_HEIGHT_PX = 8;
export const CHAR_PANTS_Y_OFFSET_PX = 10;
export const CHAR_TORSO_HALF_WIDTH_PX = 8;
export const CHAR_TORSO_WIDTH_PX = 16;
export const CHAR_TORSO_HEIGHT_PX = 14;
export const CHAR_TORSO_Y_OFFSET_PX = 2;
export const CHAR_HEAD_RADIUS_PX = 6;
export const CHAR_HEAD_Y_OFFSET_PX = 10;
export const CHAR_HAIR_Y_OFFSET_PX = 12;
export const NOSH_FEET_Y_OFFSET_PX = 6;
export const NOSH_BODY_Y_OFFSET_PX = 6;
export const NOSH_WALK_BOB_AMPLITUDE_PX = 1.5;
export const NPC_FEET_Y_OFFSET_PX = 8;
export const NPC_BODY_Y_OFFSET_PX = 2;
export const NAMEPLATE_Y_OFFSET_PX = 22;
export const NEON_SIGN_Y_OFFSET_PX = 28;
