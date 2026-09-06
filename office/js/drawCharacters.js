import {
  CHAR_ARM_HEIGHT_PX,
  CHAR_ARM_WIDTH_PX,
  CHAR_ARM_X_OFFSET_PX,
  CHAR_ARM_Y_OFFSET_PX,
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
  CHAR_TORSO_HEIGHT_PX,
  CHAR_TORSO_WIDTH_PX,
  CHAR_TORSO_Y_OFFSET_PX,
  DEFAULT_SILHOUETTE,
  INK,
  NOSH_BODY_Y_OFFSET_PX,
  NOSH_FEET_Y_OFFSET_PX,
  NOSH_WALK_BOB_AMPLITUDE_PX,
  NPC_BODY_Y_OFFSET_PX,
  NPC_FEET_Y_OFFSET_PX,
  NPC_IDLE_BOB_AMPLITUDE_PX,
  NPC_IDLE_BOB_RATE,
  NPC_PANTS_FILL,
  NPC_SHOE_FILL,
  NPC_SKIN_FILL,
  PLAYER_JACKET_FILL,
  PLAYER_PANTS_FILL,
  PLAYER_SHOE_FILL,
  PLAYER_SKIN_FILL,
  PLAYER_STAFF_ID,
  SilhouetteStyle,
} from "./constants.js";

function styleForStaff(staffId) {
  return SilhouetteStyle[staffId] || DEFAULT_SILHOUETTE;
}

function drawHair(
  context,
  centerX,
  headY,
  hairKind,
  hairFill,
  headRadius
) {
  context.fillStyle = hairFill;
  context.strokeStyle = INK;
  context.lineWidth = 1;

  if (hairKind === "sweep") {
    context.beginPath();
    context.ellipse(
      centerX + 2,
      headY - 2,
      headRadius + 3,
      headRadius + 1,
      -0.35,
      0,
      Math.PI * 2
    );
    context.fill();
    context.stroke();
    return;
  }

  if (hairKind === "tuft") {
    context.beginPath();
    context.arc(
      centerX,
      headY - 1,
      headRadius,
      Math.PI,
      0
    );
    context.fill();
    context.fillRect(
      centerX - 2,
      headY - headRadius - 4,
      4,
      5
    );
    return;
  }

  if (hairKind === "sharp") {
    context.beginPath();
    context.moveTo(
      centerX - headRadius - 1,
      headY
    );
    context.lineTo(
      centerX,
      headY - headRadius - 3
    );
    context.lineTo(
      centerX + headRadius + 1,
      headY
    );
    context.closePath();
    context.fill();
    context.stroke();
    return;
  }

  if (hairKind === "bowl") {
    context.beginPath();
    context.arc(
      centerX,
      headY,
      headRadius + 1,
      Math.PI,
      0
    );
    context.fill();
    context.fillRect(
      centerX - headRadius - 1,
      headY - 1,
      headRadius * 2 + 2,
      4
    );
    return;
  }

  if (hairKind === "crest") {
    context.beginPath();
    context.arc(
      centerX,
      headY - 1,
      headRadius,
      Math.PI,
      0
    );
    context.fill();
    context.fillRect(
      centerX - 3,
      headY - headRadius - 2,
      6,
      3
    );
    return;
  }

  context.beginPath();
  context.arc(
    centerX,
    headY - 1,
    headRadius,
    Math.PI,
    0
  );
  context.fill();
}

function drawSilhouetteBody(
  context,
  centerX,
  bodyY,
  feetY,
  jacketFill,
  skinFill,
  pantsFill,
  shoeFill,
  style
) {
  const torsoWidth = Math.round(
    CHAR_TORSO_WIDTH_PX * style.torsoScale
  );
  const torsoHalf = Math.round(torsoWidth / 2);
  const armX = CHAR_ARM_X_OFFSET_PX
    + Math.round((style.torsoScale - 1) * 4);

  context.fillStyle = shoeFill;
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

  context.fillStyle = pantsFill;
  context.fillRect(
    centerX - CHAR_PANTS_HALF_WIDTH_PX,
    bodyY + CHAR_PANTS_Y_OFFSET_PX,
    CHAR_PANTS_WIDTH_PX,
    CHAR_PANTS_HEIGHT_PX
  );

  context.fillStyle = jacketFill;
  context.fillRect(
    centerX - armX,
    bodyY + CHAR_ARM_Y_OFFSET_PX,
    CHAR_ARM_WIDTH_PX,
    CHAR_ARM_HEIGHT_PX
  );
  context.fillRect(
    centerX + armX - CHAR_ARM_WIDTH_PX,
    bodyY + CHAR_ARM_Y_OFFSET_PX,
    CHAR_ARM_WIDTH_PX,
    CHAR_ARM_HEIGHT_PX
  );
  context.fillRect(
    centerX - torsoHalf,
    bodyY - CHAR_TORSO_Y_OFFSET_PX,
    torsoWidth,
    CHAR_TORSO_HEIGHT_PX
  );
  context.strokeStyle = INK;
  context.lineWidth = 1;
  context.strokeRect(
    centerX - torsoHalf,
    bodyY - CHAR_TORSO_Y_OFFSET_PX,
    torsoWidth,
    CHAR_TORSO_HEIGHT_PX
  );

  const headY = bodyY - CHAR_HEAD_Y_OFFSET_PX;

  context.fillStyle = skinFill;
  context.beginPath();
  context.arc(
    centerX,
    headY,
    CHAR_HEAD_RADIUS_PX,
    0,
    Math.PI * 2
  );
  context.fill();
  context.stroke();

  drawHair(
    context,
    centerX,
    bodyY - CHAR_HAIR_Y_OFFSET_PX,
    style.hairKind,
    style.hairFill,
    CHAR_HEAD_RADIUS_PX
  );
}

export function drawNoshSilhouette(
  context,
  centerX,
  centerY,
  walkBobPhase
) {
  const style = styleForStaff(PLAYER_STAFF_ID);
  const bobOffset =
    Math.sin(walkBobPhase) * NOSH_WALK_BOB_AMPLITUDE_PX;
  const feetY = centerY + NOSH_FEET_Y_OFFSET_PX;
  const bodyY =
    centerY
    - NOSH_BODY_Y_OFFSET_PX
    + bobOffset
    + style.postureY;

  drawSilhouetteBody(
    context,
    centerX,
    bodyY,
    feetY,
    PLAYER_JACKET_FILL,
    PLAYER_SKIN_FILL,
    PLAYER_PANTS_FILL,
    PLAYER_SHOE_FILL,
    style
  );
}

export function drawNpcSilhouette(
  context,
  centerX,
  centerY,
  staffId,
  jacketFill,
  animSeconds,
  reduceMotion
) {
  const style = styleForStaff(staffId);
  const phaseOffset = staffId ? staffId.length : 0;
  const idleBob = reduceMotion
    ? 0
    : Math.sin(
      (animSeconds + phaseOffset) * NPC_IDLE_BOB_RATE
    ) * NPC_IDLE_BOB_AMPLITUDE_PX;
  const feetY = centerY + NPC_FEET_Y_OFFSET_PX;
  const bodyY =
    centerY
    - NPC_BODY_Y_OFFSET_PX
    + style.postureY
    + idleBob;

  drawSilhouetteBody(
    context,
    centerX,
    bodyY,
    feetY,
    jacketFill,
    NPC_SKIN_FILL,
    NPC_PANTS_FILL,
    NPC_SHOE_FILL,
    style
  );
}
