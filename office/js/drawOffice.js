import {
  BONE,
  CHAIR_FILL,
  FloorFill,
  FloorTileKind,
  FurnitureFill,
  FurnitureKind,
  INK,
  PLAYER_DESK_ACCENT,
  SCREEN_FILL,
  TILE_HEIGHT_PX,
  TILE_WIDTH_PX,
} from "./constants.js";
import { buildRoomOrigin, gridToScreen } from "./isoMath.js";

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

function drawNameplate(
  context,
  centerX,
  centerY,
  label
) {
  context.font = "11px \"IBM Plex Sans\", sans-serif";
  context.textAlign = "center";
  context.textBaseline = "top";
  context.fillStyle = INK;
  context.fillText(label, centerX, centerY + 22);
}

function drawFurniture(
  context,
  office,
  staffLookup,
  originX,
  originY
) {
  const sortedFurniture = [...office.furniture].sort(
    (left, right) => {
      const leftDepth = left.gridX + left.gridY;
      const rightDepth = right.gridX + right.gridY;

      return leftDepth - rightDepth;
    }
  );

  for (const piece of sortedFurniture) {
    const { screenX, screenY } = gridToScreen(
      piece.gridX,
      piece.gridY
    );
    const centerX = originX + screenX;
    const centerY = originY + screenY;

    if (piece.kind === FurnitureKind.BUBBLER) {
      drawBubblerPlaceholder(context, centerX, centerY);
      drawNameplate(context, centerX, centerY, "Bubbler");
      continue;
    }

    if (piece.kind === FurnitureKind.DESK) {
      drawDeskPlaceholder(
        context,
        centerX,
        centerY,
        Boolean(piece.isPlayerDesk)
      );

      const person = staffLookup[piece.staffId];
      const label = person
        ? person.displayName
        : piece.id;

      drawNameplate(context, centerX, centerY, label);
    }
  }
}

export function drawOffice(
  canvas,
  office,
  staffLookup,
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
  drawFurniture(
    context,
    office,
    staffLookup,
    originX,
    originY
  );
}
