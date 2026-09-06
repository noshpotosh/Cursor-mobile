import {
  BONE,
  BUBBLER_BOTTLE_RADIUS_PX,
  BUBBLER_BOTTLE_Y_OFFSET_PX,
  BUBBLER_HALF_WIDTH_PX,
  BUBBLER_HEIGHT_PX,
  BUBBLER_TOP_OFFSET_PX,
  BUBBLER_WIDTH_PX,
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
  COFFEE_STEAM_WAVE_PX,
  COFFEE_STEAM_WAVE_RATE,
  COFFEE_STEAM_X_SPREAD_PX,
  FurnitureFill,
  FurnitureKind,
  INK,
  NAMEPLATE_Y_OFFSET_PX,
  NEON_SIGN_FILL,
  NEON_SIGN_Y_OFFSET_PX,
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
import { gridToScreen } from "./isoMath.js";

export function drawAmberNeon(context, originX, originY, office) {
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

export function drawBubblerPlaceholder(context, centerX, centerY) {
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

export function drawCoffeePlaceholder(
  context,
  centerX,
  centerY,
  animSeconds = 0,
  reduceMotion = false
) {
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

  const steamWave = reduceMotion
    ? 0
    : Math.sin(animSeconds * COFFEE_STEAM_WAVE_RATE)
      * COFFEE_STEAM_WAVE_PX;

  context.strokeStyle = INK;
  context.beginPath();
  context.moveTo(
    centerX - 2,
    centerY - COFFEE_STEAM_BASE_Y_PX
  );
  context.quadraticCurveTo(
    centerX - COFFEE_STEAM_X_SPREAD_PX + steamWave,
    centerY - COFFEE_STEAM_MID_Y_PX,
    centerX - 1 + steamWave * 0.5,
    centerY - COFFEE_STEAM_TOP_Y_PX
  );
  context.moveTo(
    centerX + 2,
    centerY - COFFEE_STEAM_BASE_Y_PX
  );
  context.quadraticCurveTo(
    centerX + COFFEE_STEAM_X_SPREAD_PX - steamWave,
    centerY - COFFEE_STEAM_MID_Y_PX,
    centerX + 1 - steamWave * 0.5,
    centerY - COFFEE_STEAM_TOP_Y_PX
  );
  context.stroke();
}

export function drawWhiteboardPlaceholder(context, centerX, centerY) {
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

export function drawNameplate(context, centerX, centerY, label) {
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

