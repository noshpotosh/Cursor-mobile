import {
  BETTER_CHAIR_BACK_HEIGHT_PX,
  BETTER_CHAIR_BACK_Y_OFFSET_PX,
  BETTER_CHAIR_FILL,
  BETTER_CHAIR_HALF_WIDTH_PX,
  BETTER_CHAIR_HEIGHT_PX,
  BETTER_CHAIR_WIDTH_PX,
  BETTER_CHAIR_Y_OFFSET_PX,
  CHAIR_FILL,
  CHAIR_HALF_WIDTH_PX,
  CHAIR_HEIGHT_PX,
  CHAIR_LEG_HEIGHT_PX,
  CHAIR_LEG_INSET_PX,
  CHAIR_LEG_WIDTH_PX,
  CHAIR_WIDTH_PX,
  CHAIR_Y_OFFSET_PX,
  DESK_EDGE_FILL,
  DESK_LEG_FILL,
  DESK_LEG_HALF_WIDTH_PX,
  DESK_LEG_HEIGHT_PX,
  DESK_LEG_WIDTH_PX,
  DESK_LEG_Y_OFFSET_PX,
  DESK_LAMP_FILL,
  DESK_LAMP_GLOW_FILL,
  DESK_SHADOW_BOTTOM_OFFSET_PX,
  DESK_SHADOW_FILL,
  DESK_SHADOW_HALF_WIDTH_PX,
  DESK_SHADOW_SIDE_Y_PX,
  DESK_SHADOW_TOP_OFFSET_PX,
  DESK_THICKNESS_Y_PX,
  DESK_TOP_BOTTOM_OFFSET_PX,
  DESK_TOP_HALF_WIDTH_PX,
  DESK_TOP_SIDE_Y_PX,
  DESK_TOP_TOP_OFFSET_PX,
  FurnitureFill,
  FurnitureKind,
  INK,
  LAMP_ARM_X_OFFSET_PX,
  LAMP_ARM_Y_OFFSET_PX,
  LAMP_BASE_HEIGHT_PX,
  LAMP_BASE_WIDTH_PX,
  LAMP_BASE_X_OFFSET_PX,
  LAMP_BASE_Y_OFFSET_PX,
  LAMP_GLOW_PULSE_AMPLITUDE,
  LAMP_GLOW_PULSE_RATE,
  LAMP_GLOW_RADIUS_PX,
  LAMP_GLOW_X_OFFSET_PX,
  LAMP_GLOW_Y_OFFSET_PX,
  LAMP_STEM_TOP_OFFSET_PX,
  LAMP_STEM_X_OFFSET_PX,
  MONITOR_BEZEL_FILL,
  MONITOR_BEZEL_INSET_PX,
  MONITOR_HALF_WIDTH_PX,
  MONITOR_HEIGHT_PX,
  MONITOR_STAND_FILL,
  MONITOR_STAND_HALF_WIDTH_PX,
  MONITOR_STAND_HEIGHT_PX,
  MONITOR_STAND_WIDTH_PX,
  MONITOR_STAND_Y_OFFSET_PX,
  MONITOR_TOP_OFFSET_PX,
  MONITOR_WIDTH_PX,
  NOSH_DESK_MAT_FILL,
  NOSH_MAT_HEIGHT_PX,
  NOSH_MAT_HALF_WIDTH_PX,
  NOSH_MAT_WIDTH_PX,
  NOSH_MAT_Y_OFFSET_PX,
  PLAYER_ACCENT_HALF_WIDTH_PX,
  PLAYER_ACCENT_HEIGHT_PX,
  PLAYER_ACCENT_WIDTH_PX,
  PLAYER_ACCENT_Y_OFFSET_PX,
  PLAYER_DESK_ACCENT,
  PLANT_LEAF_FILL,
  PLANT_LEAF_RADIUS_PX,
  PLANT_LEAF_X_OFFSET_PX,
  PLANT_LEAF_Y_OFFSET_PX,
  PLANT_POT_FILL,
  PLANT_POT_HEIGHT_PX,
  PLANT_POT_WIDTH_PX,
  PLANT_POT_X_OFFSET_PX,
  PLANT_POT_Y_OFFSET_PX,
  SCREEN_FILL,
  UpgradeId,
} from "./constants.js";

export function drawDeskPlant(context, centerX, centerY) {
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

export function drawDeskLamp(
  context,
  centerX,
  centerY,
  animSeconds,
  reduceMotion
) {
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
  const glowPulse = reduceMotion
    ? 1
    : 1 + Math.sin(animSeconds * LAMP_GLOW_PULSE_RATE)
      * LAMP_GLOW_PULSE_AMPLITUDE;
  context.fillStyle = DESK_LAMP_GLOW_FILL;
  context.beginPath();
  context.arc(
    centerX - LAMP_GLOW_X_OFFSET_PX,
    centerY - LAMP_GLOW_Y_OFFSET_PX,
    LAMP_GLOW_RADIUS_PX * glowPulse,
    0,
    Math.PI * 2
  );
  context.fill();
}

export function drawDeskChair(
  context,
  centerX,
  centerY,
  betterChairs
) {
  const chairFill = betterChairs
    ? BETTER_CHAIR_FILL
    : CHAIR_FILL;
  const half = betterChairs
    ? BETTER_CHAIR_HALF_WIDTH_PX
    : CHAIR_HALF_WIDTH_PX;
  const width = betterChairs
    ? BETTER_CHAIR_WIDTH_PX
    : CHAIR_WIDTH_PX;
  const height = betterChairs
    ? BETTER_CHAIR_HEIGHT_PX
    : CHAIR_HEIGHT_PX;
  const yOffset = betterChairs
    ? BETTER_CHAIR_Y_OFFSET_PX
    : CHAIR_Y_OFFSET_PX;

  context.fillStyle = DESK_LEG_FILL;
  context.fillRect(
    centerX - half + CHAIR_LEG_INSET_PX,
    centerY + yOffset + height,
    CHAIR_LEG_WIDTH_PX,
    CHAIR_LEG_HEIGHT_PX
  );
  context.fillRect(
    centerX + half - CHAIR_LEG_INSET_PX - CHAIR_LEG_WIDTH_PX,
    centerY + yOffset + height,
    CHAIR_LEG_WIDTH_PX,
    CHAIR_LEG_HEIGHT_PX
  );

  context.fillStyle = chairFill;
  context.strokeStyle = INK;
  context.lineWidth = 1;
  context.fillRect(
    centerX - half,
    centerY + yOffset,
    width,
    height
  );
  context.strokeRect(
    centerX - half,
    centerY + yOffset,
    width,
    height
  );

  if (betterChairs) {
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
  }
}

export function drawDeskPlaceholder(
  context,
  centerX,
  centerY,
  isPlayerDesk,
  loftUpgrades,
  animSeconds,
  reduceMotion
) {
  const deskFill = FurnitureFill[FurnitureKind.DESK];
  const betterChairs = loftUpgrades[UpgradeId.BETTER_CHAIRS];
  const deskPlants = loftUpgrades[UpgradeId.DESK_PLANTS];
  const deskLamps = loftUpgrades[UpgradeId.DESK_LAMPS];

  context.fillStyle = DESK_SHADOW_FILL;
  context.beginPath();
  context.moveTo(
    centerX,
    centerY - DESK_SHADOW_TOP_OFFSET_PX
  );
  context.lineTo(
    centerX + DESK_SHADOW_HALF_WIDTH_PX,
    centerY + DESK_SHADOW_SIDE_Y_PX
  );
  context.lineTo(
    centerX,
    centerY + DESK_SHADOW_BOTTOM_OFFSET_PX
  );
  context.lineTo(
    centerX - DESK_SHADOW_HALF_WIDTH_PX,
    centerY + DESK_SHADOW_SIDE_Y_PX
  );
  context.closePath();
  context.fill();

  context.fillStyle = DESK_LEG_FILL;
  context.fillRect(
    centerX - DESK_LEG_HALF_WIDTH_PX,
    centerY + DESK_LEG_Y_OFFSET_PX,
    DESK_LEG_WIDTH_PX,
    DESK_LEG_HEIGHT_PX
  );
  context.fillRect(
    centerX + DESK_LEG_HALF_WIDTH_PX - DESK_LEG_WIDTH_PX,
    centerY + DESK_LEG_Y_OFFSET_PX,
    DESK_LEG_WIDTH_PX,
    DESK_LEG_HEIGHT_PX
  );

  context.fillStyle = DESK_EDGE_FILL;
  context.strokeStyle = INK;
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(
    centerX - DESK_TOP_HALF_WIDTH_PX,
    centerY - DESK_TOP_SIDE_Y_PX
  );
  context.lineTo(
    centerX,
    centerY + DESK_TOP_BOTTOM_OFFSET_PX
  );
  context.lineTo(
    centerX + DESK_TOP_HALF_WIDTH_PX,
    centerY - DESK_TOP_SIDE_Y_PX
  );
  context.lineTo(
    centerX + DESK_TOP_HALF_WIDTH_PX,
    centerY - DESK_TOP_SIDE_Y_PX + DESK_THICKNESS_Y_PX
  );
  context.lineTo(
    centerX,
    centerY + DESK_TOP_BOTTOM_OFFSET_PX + DESK_THICKNESS_Y_PX
  );
  context.lineTo(
    centerX - DESK_TOP_HALF_WIDTH_PX,
    centerY - DESK_TOP_SIDE_Y_PX + DESK_THICKNESS_Y_PX
  );
  context.closePath();
  context.fill();
  context.stroke();

  context.fillStyle = deskFill;
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

  if (isPlayerDesk) {
    context.fillStyle = NOSH_DESK_MAT_FILL;
    context.fillRect(
      centerX - NOSH_MAT_HALF_WIDTH_PX,
      centerY - NOSH_MAT_Y_OFFSET_PX,
      NOSH_MAT_WIDTH_PX,
      NOSH_MAT_HEIGHT_PX
    );
    context.strokeStyle = INK;
    context.strokeRect(
      centerX - NOSH_MAT_HALF_WIDTH_PX,
      centerY - NOSH_MAT_Y_OFFSET_PX,
      NOSH_MAT_WIDTH_PX,
      NOSH_MAT_HEIGHT_PX
    );
  }

  context.fillStyle = MONITOR_STAND_FILL;
  context.fillRect(
    centerX - MONITOR_STAND_HALF_WIDTH_PX,
    centerY - MONITOR_STAND_Y_OFFSET_PX,
    MONITOR_STAND_WIDTH_PX,
    MONITOR_STAND_HEIGHT_PX
  );

  context.fillStyle = MONITOR_BEZEL_FILL;
  context.fillRect(
    centerX - MONITOR_HALF_WIDTH_PX - MONITOR_BEZEL_INSET_PX,
    centerY - MONITOR_TOP_OFFSET_PX - MONITOR_BEZEL_INSET_PX,
    MONITOR_WIDTH_PX + MONITOR_BEZEL_INSET_PX * 2,
    MONITOR_HEIGHT_PX + MONITOR_BEZEL_INSET_PX * 2
  );
  context.fillStyle = SCREEN_FILL;
  context.fillRect(
    centerX - MONITOR_HALF_WIDTH_PX,
    centerY - MONITOR_TOP_OFFSET_PX,
    MONITOR_WIDTH_PX,
    MONITOR_HEIGHT_PX
  );
  context.strokeStyle = INK;
  context.strokeRect(
    centerX - MONITOR_HALF_WIDTH_PX - MONITOR_BEZEL_INSET_PX,
    centerY - MONITOR_TOP_OFFSET_PX - MONITOR_BEZEL_INSET_PX,
    MONITOR_WIDTH_PX + MONITOR_BEZEL_INSET_PX * 2,
    MONITOR_HEIGHT_PX + MONITOR_BEZEL_INSET_PX * 2
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
    drawDeskLamp(
      context,
      centerX,
      centerY,
      animSeconds,
      reduceMotion
    );
  }
}

