import {
  BETTER_CHAIR_BACK_HEIGHT_PX,
  BETTER_CHAIR_BACK_Y_OFFSET_PX,
  BETTER_CHAIR_FILL,
  BETTER_CHAIR_HALF_WIDTH_PX,
  BETTER_CHAIR_HEIGHT_PX,
  BETTER_CHAIR_WIDTH_PX,
  BETTER_CHAIR_Y_OFFSET_PX,
  BONE,
  BUBBLER_BOTTLE_RADIUS_PX,
  BUBBLER_BOTTLE_Y_OFFSET_PX,
  BUBBLER_HALF_WIDTH_PX,
  BUBBLER_HEIGHT_PX,
  BUBBLER_TOP_OFFSET_PX,
  BUBBLER_WIDTH_PX,
  CAMERA_FOLLOW_BLEND,
  CHAIR_FILL,
  CHAIR_HALF_WIDTH_PX,
  CHAIR_HEIGHT_PX,
  CHAIR_WIDTH_PX,
  CHAIR_Y_OFFSET_PX,
  CHAR_HAIR_Y_OFFSET_PX,
  CHAR_HEAD_RADIUS_PX,
  CHAR_HEAD_Y_OFFSET_PX,
  CHAR_PANTS_HALF_WIDTH_PX,
  CHAR_PANTS_HEIGHT_PX,
  CHAR_PANTS_WIDTH_PX,
  CHAR_PANTS_Y_OFFSET_PX,
  CHAR_SHOE_HALF_GAP_PX,
  CHAR_SHOE_HEIGHT_PX,
  CHAR_SHOE_INNER_X_PX,
  CHAR_SHOE_WIDTH_PX,
  CHAR_TORSO_HALF_WIDTH_PX,
  CHAR_TORSO_HEIGHT_PX,
  CHAR_TORSO_WIDTH_PX,
  CHAR_TORSO_Y_OFFSET_PX,
  COFFEE_BASE_HALF_WIDTH_PX,
  COFFEE_BASE_HEIGHT_PX,
  COFFEE_BASE_WIDTH_PX,
  COFFEE_BASE_Y_OFFSET_PX,
  COFFEE_BREW_FILL,
  COFFEE_BREW_HALF_WIDTH_PX,
  COFFEE_BREW_HEIGHT_PX,
  COFFEE_BREW_TOP_OFFSET_PX,
  COFFEE_BREW_WIDTH_PX,
  COFFEE_POT_FILL,
  COFFEE_POT_HALF_WIDTH_PX,
  COFFEE_POT_HEIGHT_PX,
  COFFEE_POT_TOP_OFFSET_PX,
  COFFEE_POT_WIDTH_PX,
  COFFEE_STEAM_BASE_Y_PX,
  COFFEE_STEAM_MID_Y_PX,
  COFFEE_STEAM_TOP_Y_PX,
  COFFEE_STEAM_X_SPREAD_PX,
  DESK_LAMP_FILL,
  DESK_LAMP_GLOW_FILL,
  DESK_TOP_BOTTOM_OFFSET_PX,
  DESK_TOP_HALF_WIDTH_PX,
  DESK_TOP_SIDE_Y_PX,
  DESK_TOP_TOP_OFFSET_PX,
  FloorFill,
  FloorTileKind,
  FurnitureFill,
  FurnitureKind,
  INK,
  LAMP_ARM_X_OFFSET_PX,
  LAMP_ARM_Y_OFFSET_PX,
  LAMP_BASE_HEIGHT_PX,
  LAMP_BASE_WIDTH_PX,
  LAMP_BASE_X_OFFSET_PX,
  LAMP_BASE_Y_OFFSET_PX,
  LAMP_GLOW_RADIUS_PX,
  LAMP_GLOW_X_OFFSET_PX,
  LAMP_GLOW_Y_OFFSET_PX,
  LAMP_STEM_TOP_OFFSET_PX,
  LAMP_STEM_X_OFFSET_PX,
  MONITOR_HALF_WIDTH_PX,
  MONITOR_HEIGHT_PX,
  MONITOR_TOP_OFFSET_PX,
  MONITOR_WIDTH_PX,
  NAMEPLATE_Y_OFFSET_PX,
  NEON_SIGN_FILL,
  NEON_SIGN_Y_OFFSET_PX,
  NOSH_BODY_Y_OFFSET_PX,
  NOSH_FEET_Y_OFFSET_PX,
  NOSH_WALK_BOB_AMPLITUDE_PX,
  NPC_BODY_Y_OFFSET_PX,
  NPC_FEET_Y_OFFSET_PX,
  NPC_HAIR_FILL,
  NPC_PANTS_FILL,
  NPC_SHOE_FILL,
  NPC_SKIN_FILL,
  PATH_TARGET_FILL,
  PATH_TARGET_STROKE,
  PLANT_LEAF_FILL,
  PLANT_LEAF_RADIUS_PX,
  PLANT_LEAF_X_OFFSET_PX,
  PLANT_LEAF_Y_OFFSET_PX,
  PLANT_POT_FILL,
  PLANT_POT_HEIGHT_PX,
  PLANT_POT_WIDTH_PX,
  PLANT_POT_X_OFFSET_PX,
  PLANT_POT_Y_OFFSET_PX,
  PLAYER_ACCENT_HALF_WIDTH_PX,
  PLAYER_ACCENT_HEIGHT_PX,
  PLAYER_ACCENT_WIDTH_PX,
  PLAYER_ACCENT_Y_OFFSET_PX,
  PLAYER_DESK_ACCENT,
  PLAYER_HAIR_FILL,
  PLAYER_JACKET_FILL,
  PLAYER_PANTS_FILL,
  PLAYER_SHOE_FILL,
  PLAYER_SKIN_FILL,
  SCREEN_FILL,
  TILE_HEIGHT_PX,
  TILE_WIDTH_PX,
  UpgradeId,
  WHITEBOARD_FRAME_FILL,
  WHITEBOARD_HALF_WIDTH_PX,
  WHITEBOARD_HEIGHT_PX,
  WHITEBOARD_INK_FILL,
  WHITEBOARD_LINE_LEFT_PX,
  WHITEBOARD_LINE_RIGHT_1_PX,
  WHITEBOARD_LINE_RIGHT_2_PX,
  WHITEBOARD_LINE_RIGHT_3_PX,
  WHITEBOARD_LINE_Y1_PX,
  WHITEBOARD_LINE_Y2_PX,
  WHITEBOARD_LINE_Y3_PX,
  WHITEBOARD_PAD_HEIGHT_PX,
  WHITEBOARD_PAD_INSET_PX,
  WHITEBOARD_PAD_WIDTH_PX,
  WHITEBOARD_TOP_OFFSET_PX,
  WHITEBOARD_WIDTH_PX,
} from "./constants.js";
import { buildRoomOrigin, gridToScreen } from "./isoMath.js";
import {
  isPlayerMoving,
  playerPathTarget,
} from "./player.js";

function drawDiamond(context, centerX, centerY, fill) {
  const halfWidth = TILE_WIDTH_PX / 2;
  const halfHeight = TILE_HEIGHT_PX / 2;

  context.beginPath();
  context.moveTo(centerX, centerY - halfHeight);
  context.lineTo(centerX + halfWidth, centerY);
  context.lineTo(centerX, centerY + halfHeight);
  context.lineTo(centerX - halfWidth, centerY);
  context.closePath();
  context.fillStyle = fill;
  context.fill();
  context.strokeStyle = INK;
  context.lineWidth = 1;
  context.stroke();
}

function isBorderTile(gridX, gridY, gridWidth, gridHeight) {
  const onLeft = gridX === 0;
  const onRight = gridX === gridWidth - 1;
  const onTop = gridY === 0;
  const onBottom = gridY === gridHeight - 1;

  return onLeft || onRight || onTop || onBottom;
}

function tileFillForCell(office, gridX, gridY) {
  const onBorder = isBorderTile(
    gridX,
    gridY,
    office.gridWidth,
    office.gridHeight
  );

  if (onBorder) {
    return FloorFill[FloorTileKind.WOOD];
  }

  return FloorFill[FloorTileKind.CARPET];
}

function drawFloor(context, office, originX, originY) {
  for (let gridY = 0; gridY < office.gridHeight; gridY += 1) {
    for (let gridX = 0; gridX < office.gridWidth; gridX += 1) {
      const { screenX, screenY } = gridToScreen(gridX, gridY);
      const centerX = originX + screenX;
      const centerY = originY + screenY;
      const fill = tileFillForCell(office, gridX, gridY);

      drawDiamond(context, centerX, centerY, fill);
    }
  }
}

function drawDeskPlant(context, centerX, centerY) {
  context.fillStyle = PLANT_POT_FILL;
  context.strokeStyle = INK;
  context.lineWidth = 1;
  context.fillRect(
    centerX + PLANT_POT_X_OFFSET_PX,
    centerY - PLANT_POT_Y_OFFSET_PX,
    PLANT_POT_WIDTH_PX,
    PLANT_POT_HEIGHT_PX
  );
  context.strokeRect(
    centerX + PLANT_POT_X_OFFSET_PX,
    centerY - PLANT_POT_Y_OFFSET_PX,
    PLANT_POT_WIDTH_PX,
    PLANT_POT_HEIGHT_PX
  );

  context.fillStyle = PLANT_LEAF_FILL;
  context.beginPath();
  context.arc(
    centerX + PLANT_LEAF_X_OFFSET_PX,
    centerY - PLANT_LEAF_Y_OFFSET_PX,
    PLANT_LEAF_RADIUS_PX,
    0,
    Math.PI * 2
  );
  context.fill();
  context.stroke();
}

function drawDeskLamp(context, centerX, centerY) {
  context.fillStyle = DESK_LAMP_FILL;
  context.strokeStyle = INK;
  context.lineWidth = 1;
  context.fillRect(
    centerX - LAMP_BASE_X_OFFSET_PX,
    centerY - LAMP_BASE_Y_OFFSET_PX,
    LAMP_BASE_WIDTH_PX,
    LAMP_BASE_HEIGHT_PX
  );
  context.strokeRect(
    centerX - LAMP_BASE_X_OFFSET_PX,
    centerY - LAMP_BASE_Y_OFFSET_PX,
    LAMP_BASE_WIDTH_PX,
    LAMP_BASE_HEIGHT_PX
  );
  context.beginPath();
  context.moveTo(
    centerX - LAMP_STEM_X_OFFSET_PX,
    centerY - LAMP_BASE_Y_OFFSET_PX
  );
  context.lineTo(
    centerX - LAMP_STEM_X_OFFSET_PX,
    centerY - LAMP_STEM_TOP_OFFSET_PX
  );
  context.lineTo(
    centerX - LAMP_ARM_X_OFFSET_PX,
    centerY - LAMP_ARM_Y_OFFSET_PX
  );
  context.stroke();
  context.fillStyle = DESK_LAMP_GLOW_FILL;
  context.beginPath();
  context.arc(
    centerX - LAMP_GLOW_X_OFFSET_PX,
    centerY - LAMP_GLOW_Y_OFFSET_PX,
    LAMP_GLOW_RADIUS_PX,
    0,
    Math.PI * 2
  );
  context.fill();
}

function drawDeskChair(
  context,
  centerX,
  centerY,
  betterChairs
) {
  const chairFill = betterChairs
    ? BETTER_CHAIR_FILL
    : CHAIR_FILL;

  context.fillStyle = chairFill;
  context.strokeStyle = INK;
  context.lineWidth = 1;

  if (betterChairs) {
    context.fillRect(
      centerX - BETTER_CHAIR_HALF_WIDTH_PX,
      centerY + BETTER_CHAIR_Y_OFFSET_PX,
      BETTER_CHAIR_WIDTH_PX,
      BETTER_CHAIR_HEIGHT_PX
    );
    context.strokeRect(
      centerX - BETTER_CHAIR_HALF_WIDTH_PX,
      centerY + BETTER_CHAIR_Y_OFFSET_PX,
      BETTER_CHAIR_WIDTH_PX,
      BETTER_CHAIR_HEIGHT_PX
    );
    context.fillRect(
      centerX - BETTER_CHAIR_HALF_WIDTH_PX,
      centerY + BETTER_CHAIR_BACK_Y_OFFSET_PX,
      BETTER_CHAIR_WIDTH_PX,
      BETTER_CHAIR_BACK_HEIGHT_PX
    );
    context.strokeRect(
      centerX - BETTER_CHAIR_HALF_WIDTH_PX,
      centerY + BETTER_CHAIR_BACK_Y_OFFSET_PX,
      BETTER_CHAIR_WIDTH_PX,
      BETTER_CHAIR_BACK_HEIGHT_PX
    );
    return;
  }

  context.fillRect(
    centerX - CHAIR_HALF_WIDTH_PX,
    centerY + CHAIR_Y_OFFSET_PX,
    CHAIR_WIDTH_PX,
    CHAIR_HEIGHT_PX
  );
  context.strokeRect(
    centerX - CHAIR_HALF_WIDTH_PX,
    centerY + CHAIR_Y_OFFSET_PX,
    CHAIR_WIDTH_PX,
    CHAIR_HEIGHT_PX
  );
}

function drawDeskPlaceholder(
  context,
  centerX,
  centerY,
  isPlayerDesk,
  loftUpgrades
) {
  const deskFill = FurnitureFill[FurnitureKind.DESK];
  const betterChairs = loftUpgrades[UpgradeId.BETTER_CHAIRS];
  const deskPlants = loftUpgrades[UpgradeId.DESK_PLANTS];
  const deskLamps = loftUpgrades[UpgradeId.DESK_LAMPS];

  // Desk top
  context.fillStyle = deskFill;
  context.strokeStyle = INK;
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(
    centerX,
    centerY - DESK_TOP_TOP_OFFSET_PX
  );
  context.lineTo(
    centerX + DESK_TOP_HALF_WIDTH_PX,
    centerY - DESK_TOP_SIDE_Y_PX
  );
  context.lineTo(
    centerX,
    centerY + DESK_TOP_BOTTOM_OFFSET_PX
  );
  context.lineTo(
    centerX - DESK_TOP_HALF_WIDTH_PX,
    centerY - DESK_TOP_SIDE_Y_PX
  );
  context.closePath();
  context.fill();
  context.stroke();

  drawDeskChair(context, centerX, centerY, betterChairs);

  // Monitor
  context.fillStyle = SCREEN_FILL;
  context.fillRect(
    centerX - MONITOR_HALF_WIDTH_PX,
    centerY - MONITOR_TOP_OFFSET_PX,
    MONITOR_WIDTH_PX,
    MONITOR_HEIGHT_PX
  );
  context.strokeRect(
    centerX - MONITOR_HALF_WIDTH_PX,
    centerY - MONITOR_TOP_OFFSET_PX,
    MONITOR_WIDTH_PX,
    MONITOR_HEIGHT_PX
  );

  if (isPlayerDesk) {
    context.fillStyle = PLAYER_DESK_ACCENT;
    context.fillRect(
      centerX - PLAYER_ACCENT_HALF_WIDTH_PX,
      centerY - PLAYER_ACCENT_Y_OFFSET_PX,
      PLAYER_ACCENT_WIDTH_PX,
      PLAYER_ACCENT_HEIGHT_PX
    );
  }

  if (deskPlants) {
    drawDeskPlant(context, centerX, centerY);
  }

  if (deskLamps) {
    drawDeskLamp(context, centerX, centerY);
  }
}

function drawAmberNeon(context, originX, originY, office) {
  const midX = Math.floor(office.gridWidth / 2);
  const { screenX, screenY } = gridToScreen(midX, 0);
  const centerX = originX + screenX;
  const centerY = originY + screenY - NEON_SIGN_Y_OFFSET_PX;

  context.font = "bold 14px \"IBM Plex Sans\", sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = NEON_SIGN_FILL;
  context.fillText("WAREWOLF", centerX, centerY);
  context.strokeStyle = INK;
  context.lineWidth = 1;
  context.strokeText("WAREWOLF", centerX, centerY);
}

function drawBubblerPlaceholder(context, centerX, centerY) {
  const fill = FurnitureFill[FurnitureKind.BUBBLER];

  context.fillStyle = fill;
  context.strokeStyle = INK;
  context.lineWidth = 1;
  context.fillRect(
    centerX - BUBBLER_HALF_WIDTH_PX,
    centerY - BUBBLER_TOP_OFFSET_PX,
    BUBBLER_WIDTH_PX,
    BUBBLER_HEIGHT_PX
  );
  context.strokeRect(
    centerX - BUBBLER_HALF_WIDTH_PX,
    centerY - BUBBLER_TOP_OFFSET_PX,
    BUBBLER_WIDTH_PX,
    BUBBLER_HEIGHT_PX
  );

  context.fillStyle = BONE;
  context.beginPath();
  context.arc(
    centerX,
    centerY - BUBBLER_BOTTLE_Y_OFFSET_PX,
    BUBBLER_BOTTLE_RADIUS_PX,
    0,
    Math.PI * 2
  );
  context.fill();
  context.stroke();
}

function drawCoffeePlaceholder(context, centerX, centerY) {
  // Warm carafe + steam cue so it reads apart from the bubbler.
  context.fillStyle = FurnitureFill[FurnitureKind.COFFEE];
  context.strokeStyle = INK;
  context.lineWidth = 1;
  context.fillRect(
    centerX - COFFEE_BASE_HALF_WIDTH_PX,
    centerY - COFFEE_BASE_Y_OFFSET_PX,
    COFFEE_BASE_WIDTH_PX,
    COFFEE_BASE_HEIGHT_PX
  );
  context.strokeRect(
    centerX - COFFEE_BASE_HALF_WIDTH_PX,
    centerY - COFFEE_BASE_Y_OFFSET_PX,
    COFFEE_BASE_WIDTH_PX,
    COFFEE_BASE_HEIGHT_PX
  );

  context.fillStyle = COFFEE_POT_FILL;
  context.fillRect(
    centerX - COFFEE_POT_HALF_WIDTH_PX,
    centerY - COFFEE_POT_TOP_OFFSET_PX,
    COFFEE_POT_WIDTH_PX,
    COFFEE_POT_HEIGHT_PX
  );
  context.strokeRect(
    centerX - COFFEE_POT_HALF_WIDTH_PX,
    centerY - COFFEE_POT_TOP_OFFSET_PX,
    COFFEE_POT_WIDTH_PX,
    COFFEE_POT_HEIGHT_PX
  );

  context.fillStyle = COFFEE_BREW_FILL;
  context.fillRect(
    centerX - COFFEE_BREW_HALF_WIDTH_PX,
    centerY - COFFEE_BREW_TOP_OFFSET_PX,
    COFFEE_BREW_WIDTH_PX,
    COFFEE_BREW_HEIGHT_PX
  );

  context.strokeStyle = INK;
  context.beginPath();
  context.moveTo(
    centerX - 2,
    centerY - COFFEE_STEAM_BASE_Y_PX
  );
  context.quadraticCurveTo(
    centerX - COFFEE_STEAM_X_SPREAD_PX,
    centerY - COFFEE_STEAM_MID_Y_PX,
    centerX - 1,
    centerY - COFFEE_STEAM_TOP_Y_PX
  );
  context.moveTo(
    centerX + 2,
    centerY - COFFEE_STEAM_BASE_Y_PX
  );
  context.quadraticCurveTo(
    centerX + COFFEE_STEAM_X_SPREAD_PX,
    centerY - COFFEE_STEAM_MID_Y_PX,
    centerX + 1,
    centerY - COFFEE_STEAM_TOP_Y_PX
  );
  context.stroke();
}

function drawWhiteboardPlaceholder(context, centerX, centerY) {
  context.fillStyle = WHITEBOARD_FRAME_FILL;
  context.strokeStyle = INK;
  context.lineWidth = 1;
  context.fillRect(
    centerX - WHITEBOARD_HALF_WIDTH_PX,
    centerY - WHITEBOARD_TOP_OFFSET_PX,
    WHITEBOARD_WIDTH_PX,
    WHITEBOARD_HEIGHT_PX
  );
  context.strokeRect(
    centerX - WHITEBOARD_HALF_WIDTH_PX,
    centerY - WHITEBOARD_TOP_OFFSET_PX,
    WHITEBOARD_WIDTH_PX,
    WHITEBOARD_HEIGHT_PX
  );

  context.fillStyle = FurnitureFill[FurnitureKind.WHITEBOARD];
  context.fillRect(
    centerX
      - WHITEBOARD_HALF_WIDTH_PX
      + WHITEBOARD_PAD_INSET_PX,
    centerY
      - WHITEBOARD_TOP_OFFSET_PX
      + WHITEBOARD_PAD_INSET_PX,
    WHITEBOARD_PAD_WIDTH_PX,
    WHITEBOARD_PAD_HEIGHT_PX
  );
  context.strokeRect(
    centerX
      - WHITEBOARD_HALF_WIDTH_PX
      + WHITEBOARD_PAD_INSET_PX,
    centerY
      - WHITEBOARD_TOP_OFFSET_PX
      + WHITEBOARD_PAD_INSET_PX,
    WHITEBOARD_PAD_WIDTH_PX,
    WHITEBOARD_PAD_HEIGHT_PX
  );

  context.strokeStyle = WHITEBOARD_INK_FILL;
  context.beginPath();
  context.moveTo(
    centerX - WHITEBOARD_LINE_LEFT_PX,
    centerY - WHITEBOARD_LINE_Y1_PX
  );
  context.lineTo(
    centerX + WHITEBOARD_LINE_RIGHT_1_PX,
    centerY - WHITEBOARD_LINE_Y1_PX
  );
  context.moveTo(
    centerX - WHITEBOARD_LINE_LEFT_PX,
    centerY - WHITEBOARD_LINE_Y2_PX
  );
  context.lineTo(
    centerX + WHITEBOARD_LINE_RIGHT_2_PX,
    centerY - WHITEBOARD_LINE_Y2_PX
  );
  context.moveTo(
    centerX - WHITEBOARD_LINE_LEFT_PX,
    centerY - WHITEBOARD_LINE_Y3_PX
  );
  context.lineTo(
    centerX + WHITEBOARD_LINE_RIGHT_3_PX,
    centerY - WHITEBOARD_LINE_Y3_PX
  );
  context.stroke();
}

function drawNameplate(context, centerX, centerY, label) {
  context.font = "11px \"IBM Plex Sans\", sans-serif";
  context.textAlign = "center";
  context.textBaseline = "top";
  context.fillStyle = INK;
  context.fillText(
    label,
    centerX,
    centerY + NAMEPLATE_Y_OFFSET_PX
  );
}

function drawPathTarget(
  context,
  originX,
  originY,
  target
) {
  if (!target) {
    return;
  }

  const { screenX, screenY } = gridToScreen(
    target.gridX,
    target.gridY
  );
  const centerX = originX + screenX;
  const centerY = originY + screenY;
  const halfWidth = TILE_WIDTH_PX / 2;
  const halfHeight = TILE_HEIGHT_PX / 2;

  context.beginPath();
  context.moveTo(centerX, centerY - halfHeight + 2);
  context.lineTo(centerX + halfWidth - 4, centerY);
  context.lineTo(centerX, centerY + halfHeight - 2);
  context.lineTo(centerX - halfWidth + 4, centerY);
  context.closePath();
  context.fillStyle = PATH_TARGET_FILL;
  context.fill();
  context.strokeStyle = PATH_TARGET_STROKE;
  context.lineWidth = 2;
  context.stroke();
}

// Amber jacket is the player cue until real sprites land.
function drawNoshPlaceholder(
  context,
  centerX,
  centerY,
  walkBobPhase
) {
  const bobOffset =
    Math.sin(walkBobPhase) * NOSH_WALK_BOB_AMPLITUDE_PX;
  const feetY = centerY + NOSH_FEET_Y_OFFSET_PX;
  const bodyY =
    centerY - NOSH_BODY_Y_OFFSET_PX + bobOffset;

  context.fillStyle = PLAYER_SHOE_FILL;
  context.fillRect(
    centerX - CHAR_SHOE_HALF_GAP_PX,
    feetY,
    CHAR_SHOE_WIDTH_PX,
    CHAR_SHOE_HEIGHT_PX
  );
  context.fillRect(
    centerX + CHAR_SHOE_INNER_X_PX,
    feetY,
    CHAR_SHOE_WIDTH_PX,
    CHAR_SHOE_HEIGHT_PX
  );

  context.fillStyle = PLAYER_PANTS_FILL;
  context.fillRect(
    centerX - CHAR_PANTS_HALF_WIDTH_PX,
    bodyY + CHAR_PANTS_Y_OFFSET_PX,
    CHAR_PANTS_WIDTH_PX,
    CHAR_PANTS_HEIGHT_PX
  );

  context.fillStyle = PLAYER_JACKET_FILL;
  context.fillRect(
    centerX - CHAR_TORSO_HALF_WIDTH_PX,
    bodyY - CHAR_TORSO_Y_OFFSET_PX,
    CHAR_TORSO_WIDTH_PX,
    CHAR_TORSO_HEIGHT_PX
  );
  context.strokeStyle = INK;
  context.lineWidth = 1;
  context.strokeRect(
    centerX - CHAR_TORSO_HALF_WIDTH_PX,
    bodyY - CHAR_TORSO_Y_OFFSET_PX,
    CHAR_TORSO_WIDTH_PX,
    CHAR_TORSO_HEIGHT_PX
  );

  context.fillStyle = PLAYER_SKIN_FILL;
  context.beginPath();
  context.arc(
    centerX,
    bodyY - CHAR_HEAD_Y_OFFSET_PX,
    CHAR_HEAD_RADIUS_PX,
    0,
    Math.PI * 2
  );
  context.fill();
  context.stroke();

  context.fillStyle = PLAYER_HAIR_FILL;
  context.beginPath();
  context.arc(
    centerX,
    bodyY - CHAR_HAIR_Y_OFFSET_PX,
    CHAR_HEAD_RADIUS_PX,
    Math.PI,
    0
  );
  context.fill();
}


function drawNpcPlaceholder(
  context,
  centerX,
  centerY,
  jacketFill
) {
  // Seated cue: slightly lower than a standing walker.
  const feetY = centerY + NPC_FEET_Y_OFFSET_PX;
  const bodyY = centerY - NPC_BODY_Y_OFFSET_PX;

  context.fillStyle = NPC_SHOE_FILL;
  context.fillRect(
    centerX - CHAR_SHOE_HALF_GAP_PX,
    feetY,
    CHAR_SHOE_WIDTH_PX,
    CHAR_SHOE_HEIGHT_PX
  );
  context.fillRect(
    centerX + CHAR_SHOE_INNER_X_PX,
    feetY,
    CHAR_SHOE_WIDTH_PX,
    CHAR_SHOE_HEIGHT_PX
  );

  context.fillStyle = NPC_PANTS_FILL;
  context.fillRect(
    centerX - CHAR_PANTS_HALF_WIDTH_PX,
    bodyY + CHAR_PANTS_Y_OFFSET_PX,
    CHAR_PANTS_WIDTH_PX,
    CHAR_PANTS_HEIGHT_PX
  );

  context.fillStyle = jacketFill;
  context.fillRect(
    centerX - CHAR_TORSO_HALF_WIDTH_PX,
    bodyY - CHAR_TORSO_Y_OFFSET_PX,
    CHAR_TORSO_WIDTH_PX,
    CHAR_TORSO_HEIGHT_PX
  );
  context.strokeStyle = INK;
  context.lineWidth = 1;
  context.strokeRect(
    centerX - CHAR_TORSO_HALF_WIDTH_PX,
    bodyY - CHAR_TORSO_Y_OFFSET_PX,
    CHAR_TORSO_WIDTH_PX,
    CHAR_TORSO_HEIGHT_PX
  );

  context.fillStyle = NPC_SKIN_FILL;
  context.beginPath();
  context.arc(
    centerX,
    bodyY - CHAR_HEAD_Y_OFFSET_PX,
    CHAR_HEAD_RADIUS_PX,
    0,
    Math.PI * 2
  );
  context.fill();
  context.stroke();

  context.fillStyle = NPC_HAIR_FILL;
  context.beginPath();
  context.arc(
    centerX,
    bodyY - CHAR_HAIR_Y_OFFSET_PX,
    CHAR_HEAD_RADIUS_PX,
    Math.PI,
    0
  );
  context.fill();
}

function drawFurniturePiece(
  context,
  piece,
  staffLookup,
  centerX,
  centerY,
  loftUpgrades
) {
  if (piece.kind === FurnitureKind.BUBBLER) {
    drawBubblerPlaceholder(context, centerX, centerY);
    drawNameplate(context, centerX, centerY, "Bubbler");
    return;
  }

  if (piece.kind === FurnitureKind.COFFEE) {
    drawCoffeePlaceholder(context, centerX, centerY);
    drawNameplate(context, centerX, centerY, "Coffee");
    return;
  }

  if (piece.kind === FurnitureKind.WHITEBOARD) {
    drawWhiteboardPlaceholder(context, centerX, centerY);
    drawNameplate(context, centerX, centerY, "Whiteboard");
    return;
  }

  if (piece.kind !== FurnitureKind.DESK) {
    return;
  }

  drawDeskPlaceholder(
    context,
    centerX,
    centerY,
    Boolean(piece.isPlayerDesk),
    loftUpgrades
  );

  const person = staffLookup[piece.staffId];
  const label = person ? person.displayName : piece.id;

  drawNameplate(context, centerX, centerY, label);
}

function drawWorldEntities(
  context,
  office,
  staffLookup,
  player,
  npcs,
  originX,
  originY,
  loftUpgrades
) {
  const drawables = [];

  for (const piece of office.furniture) {
    const depth = piece.gridX + piece.gridY;
    const { screenX, screenY } = gridToScreen(
      piece.gridX,
      piece.gridY
    );
    const centerX = originX + screenX;
    const centerY = originY + screenY;

    drawables.push({
      depth,
      draw() {
        drawFurniturePiece(
          context,
          piece,
          staffLookup,
          centerX,
          centerY,
          loftUpgrades
        );
      },
    });
  }

  for (const npc of npcs) {
    const depth = npc.gridX + npc.gridY + 0.1;
    const { screenX, screenY } = gridToScreen(
      npc.gridX,
      npc.gridY
    );
    const centerX = originX + screenX;
    const centerY = originY + screenY;

    drawables.push({
      depth,
      draw() {
        drawNpcPlaceholder(
          context,
          centerX,
          centerY,
          npc.jacketFill
        );
      },
    });
  }

  const { screenX, screenY } = gridToScreen(
    player.gridX,
    player.gridY
  );
  const playerCenterX = originX + screenX;
  const playerCenterY = originY + screenY;
  const playerDepth = player.gridX + player.gridY;
  const bobPhase = isPlayerMoving(player)
    ? player.walkBobPhase
    : 0;

  drawables.push({
    depth: playerDepth,
    draw() {
      drawNoshPlaceholder(
        context,
        playerCenterX,
        playerCenterY,
        bobPhase
      );
    },
  });

  drawables.sort((left, right) => left.depth - right.depth);

  for (const drawable of drawables) {
    drawable.draw();
  }
}

function emptyLoftUpgrades() {
  return {
    [UpgradeId.DESK_PLANTS]: false,
    [UpgradeId.DESK_LAMPS]: false,
    [UpgradeId.BETTER_CHAIRS]: false,
    [UpgradeId.AMBER_NEON]: false,
  };
}

export function drawOffice(
  canvas,
  office,
  staffLookup,
  player,
  npcs,
  viewWidth,
  viewHeight,
  loftUpgrades
) {
  const context = canvas.getContext("2d");
  const width = viewWidth || canvas.width;
  const height = viewHeight || canvas.height;
  const upgrades = loftUpgrades || emptyLoftUpgrades();
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  context.clearRect(0, 0, width, height);
  context.fillStyle = BONE;
  context.fillRect(0, 0, width, height);

  const { originX, originY } = buildRoomOrigin(
    office.gridWidth,
    office.gridHeight,
    width,
    height,
    player.gridX,
    player.gridY,
    reduceMotion ? 0 : CAMERA_FOLLOW_BLEND
  );

  drawFloor(context, office, originX, originY);

  if (upgrades[UpgradeId.AMBER_NEON]) {
    drawAmberNeon(context, originX, originY, office);
  }

  if (isPlayerMoving(player)) {
    drawPathTarget(
      context,
      originX,
      originY,
      playerPathTarget(player)
    );
  }

  drawWorldEntities(
    context,
    office,
    staffLookup,
    player,
    npcs,
    originX,
    originY,
    upgrades
  );

  return { originX, originY };
}
