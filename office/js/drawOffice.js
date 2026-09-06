import {
  BONE,
  CHAIR_FILL,
  FloorFill,
  FloorTileKind,
  FurnitureFill,
  FurnitureKind,
  INK,
  PATH_TARGET_FILL,
  PATH_TARGET_STROKE,
  PLAYER_DESK_ACCENT,
  PLAYER_HAIR_FILL,
  PLAYER_JACKET_FILL,
  PLAYER_PANTS_FILL,
  PLAYER_SHOE_FILL,
  PLAYER_SKIN_FILL,
  SCREEN_FILL,
  TILE_HEIGHT_PX,
  TILE_WIDTH_PX,
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

function drawDeskPlaceholder(
  context,
  centerX,
  centerY,
  isPlayerDesk
) {
  const deskFill = FurnitureFill[FurnitureKind.DESK];

  // Desk top
  context.fillStyle = deskFill;
  context.strokeStyle = INK;
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(centerX, centerY - 18);
  context.lineTo(centerX + 28, centerY - 4);
  context.lineTo(centerX, centerY + 10);
  context.lineTo(centerX - 28, centerY - 4);
  context.closePath();
  context.fill();
  context.stroke();

  // Chair
  context.fillStyle = CHAIR_FILL;
  context.fillRect(centerX - 8, centerY + 8, 16, 10);
  context.strokeRect(centerX - 8, centerY + 8, 16, 10);

  // Monitor
  context.fillStyle = SCREEN_FILL;
  context.fillRect(centerX - 7, centerY - 14, 14, 10);
  context.strokeRect(centerX - 7, centerY - 14, 14, 10);

  if (isPlayerDesk) {
    context.fillStyle = PLAYER_DESK_ACCENT;
    context.fillRect(centerX - 10, centerY - 2, 20, 3);
  }
}

function drawBubblerPlaceholder(context, centerX, centerY) {
  const fill = FurnitureFill[FurnitureKind.BUBBLER];

  context.fillStyle = fill;
  context.strokeStyle = INK;
  context.lineWidth = 1;
  context.fillRect(centerX - 8, centerY - 22, 16, 28);
  context.strokeRect(centerX - 8, centerY - 22, 16, 28);

  context.fillStyle = BONE;
  context.beginPath();
  context.arc(centerX, centerY - 26, 7, 0, Math.PI * 2);
  context.fill();
  context.stroke();
}

function drawNameplate(context, centerX, centerY, label) {
  context.font = "11px \"IBM Plex Sans\", sans-serif";
  context.textAlign = "center";
  context.textBaseline = "top";
  context.fillStyle = INK;
  context.fillText(label, centerX, centerY + 22);
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
  const bobOffset = Math.sin(walkBobPhase) * 1.5;
  const feetY = centerY + 6;
  const bodyY = centerY - 6 + bobOffset;

  context.fillStyle = PLAYER_SHOE_FILL;
  context.fillRect(centerX - 7, feetY, 5, 3);
  context.fillRect(centerX + 2, feetY, 5, 3);

  context.fillStyle = PLAYER_PANTS_FILL;
  context.fillRect(centerX - 6, bodyY + 10, 12, 8);

  context.fillStyle = PLAYER_JACKET_FILL;
  context.fillRect(centerX - 8, bodyY - 2, 16, 14);
  context.strokeStyle = INK;
  context.lineWidth = 1;
  context.strokeRect(centerX - 8, bodyY - 2, 16, 14);

  context.fillStyle = PLAYER_SKIN_FILL;
  context.beginPath();
  context.arc(centerX, bodyY - 10, 6, 0, Math.PI * 2);
  context.fill();
  context.stroke();

  context.fillStyle = PLAYER_HAIR_FILL;
  context.beginPath();
  context.arc(centerX, bodyY - 12, 6, Math.PI, 0);
  context.fill();
}

function drawFurniturePiece(
  context,
  piece,
  staffLookup,
  centerX,
  centerY
) {
  if (piece.kind === FurnitureKind.BUBBLER) {
    drawBubblerPlaceholder(context, centerX, centerY);
    drawNameplate(context, centerX, centerY, "Bubbler");
    return;
  }

  if (piece.kind !== FurnitureKind.DESK) {
    return;
  }

  drawDeskPlaceholder(
    context,
    centerX,
    centerY,
    Boolean(piece.isPlayerDesk)
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
  originX,
  originY
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
          centerY
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

export function drawOffice(
  canvas,
  office,
  staffLookup,
  player,
  viewWidth,
  viewHeight
) {
  const context = canvas.getContext("2d");
  const width = viewWidth || canvas.width;
  const height = viewHeight || canvas.height;

  context.clearRect(0, 0, width, height);
  context.fillStyle = BONE;
  context.fillRect(0, 0, width, height);

  const { originX, originY } = buildRoomOrigin(
    office.gridWidth,
    office.gridHeight,
    width,
    height
  );

  drawFloor(context, office, originX, originY);

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
    originX,
    originY
  );

  return { originX, originY };
}
