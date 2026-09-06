import { gridToScreen, measureRoomBounds } from './isoMath.js';
import { TILE_WIDTH_PX, TILE_HEIGHT_PX } from './constants.js';
import {
  Paint, polygon, rect, line, label, drawPlant, grain,
} from './pixelArt.js';
import { drawSprite } from './sprites.js';

export const WALL_HEIGHT = 180;
const roomBuffers = new WeakMap();

function floorPoint(gridX, gridY) {
  const point = gridToScreen(gridX, gridY);
  return [point.screenX, point.screenY];
}

function isEdgeTile(gridX, gridY, gridWidth, gridHeight) {
  return gridX === 0 || gridY === 0
    || gridX === gridWidth - 1 || gridY === gridHeight - 1;
}

function drawTiledFloor(context, office) {
  for (let gridY = 0; gridY < office.gridHeight; gridY += 1) {
    for (let gridX = 0; gridX < office.gridWidth; gridX += 1) {
      const { screenX, screenY } = gridToScreen(gridX, gridY);
      const tileX = screenX - TILE_WIDTH_PX / 2;
      const tileY = screenY - TILE_HEIGHT_PX / 2;

      const isEdge = isEdgeTile(gridX, gridY,
        office.gridWidth, office.gridHeight);
      const spriteId = isEdge ? 'floor-wood' : 'floor-carpet';

      drawSprite(context, spriteId, tileX, tileY,
        TILE_WIDTH_PX, TILE_HEIGHT_PX);
    }
  }
}

function drawWall(context, start, end, fill) {
  const [startX, startY] = start;
  const [endX, endY] = end;
  polygon(context, [[startX, startY], [endX, endY],
    [endX, endY - WALL_HEIGHT], [startX, startY - WALL_HEIGHT]], fill);
  grain(context, [[startX, startY], [endX, endY],
    [endX, endY - WALL_HEIGHT], [startX, startY - WALL_HEIGHT]], 7000);
  line(context, [[startX, startY - 8], [endX, endY - 8]], Paint.trim, 14);
  line(context, [[startX, startY - 16], [endX, endY - 16]], '#95704c', 4);
  line(context, [[startX, startY - WALL_HEIGHT],
    [endX, endY - WALL_HEIGHT]], Paint.trim, 14);
  line(context, [[startX, startY - WALL_HEIGHT + 8],
    [endX, endY - WALL_HEIGHT + 8]], '#a17e57', 4);
}

function drawPoster(context, x, y, lines, green = false) {
  rect(context, x - 66, y - 52, 132, 104, Paint.trim);
  rect(context, x - 62, y - 48, 124, 96, Paint.woodLight);
  rect(context, x - 56, y - 42, 112, 84,
    green ? '#3b533e' : '#e6d4ae');
  lines.forEach((text, index) => {
    label(context, text, x, y - 22 + index * 22, 20,
      green ? '#ecdcad' : Paint.ink);
  });
}

function drawWallDetails(context, office) {
  context.save();
  context.transform(1, -0.5, 0, 1, -32, -16);
  drawPoster(context, -120, -98, ['SMALL IDEAS', 'BIG IMPACT', '— ✦ —']);
  drawPoster(context, -338, -98, ['COFFEE', '+ FOCUS', '+ KINDNESS'], true);
  rect(context, -252, -56, 66, 10, Paint.woodDark);
  ['#506c66', '#976548', '#c3a372', '#374b53'].forEach((fill, i) => {
    rect(context, -246 + i * 14, -96 + i % 2 * 6, 12, 40, Paint.trim);
    rect(context, -244 + i * 14, -92 + i % 2 * 6, 8, 30, fill);
  });
  context.restore();

  context.save();
  context.transform(1, 0.5, 0, 1, 32, -16);
  drawPoster(context, 162, -98, ['MAKE THINGS', 'PEOPLE LOVE', 'WAREWOLF']);
  const doorX = (office.gridWidth - 1) * 64 - 114;
  rect(context, doorX, -148, 76, 148, Paint.trim);
  rect(context, doorX + 8, -140, 60, 132, '#93633f');
  rect(context, doorX + 16, -128, 44, 72, '#344747');
  polygon(context, [[doorX + 16, -128], [doorX + 60, -128],
    [doorX + 16, -72]], '#607776', null);
  rect(context, doorX + 52, -48, 6, 6, '#e4c58a');
  rect(context, doorX + 12, -174, 52, 20, '#466748');
  label(context, 'EXIT →', doorX + 38, -164, 12, Paint.bone);
  context.restore();
}

function drawRoomContents(context, office) {
  drawTiledFloor(context, office);
  const corner = floorPoint(-0.5, -0.5);
  drawWall(context, floorPoint(-0.5, office.gridHeight - 0.5),
    corner, Paint.wallShade);
  drawWall(context, corner,
    floorPoint(office.gridWidth - 0.5, -0.5), Paint.wall);
  drawWallDetails(context, office);
  const leftPlant = floorPoint(0, office.gridHeight - 1);
  drawPlant(context, leftPlant[0], leftPlant[1], 2.3);
  const rightPlant = floorPoint(office.gridWidth - 1, 0);
  drawPlant(context, rightPlant[0], rightPlant[1], 2.3);
}

export function drawRoom(context, office) {
  let cached = roomBuffers.get(office);
  if (!cached) {
    const bounds = measureRoomBounds(office.gridWidth, office.gridHeight);
    const edgePadding = 12;
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(bounds.width + edgePadding * 2);
    canvas.height = Math.ceil(bounds.height + edgePadding * 2);
    const roomContext = canvas.getContext('2d');
    const left = bounds.minX - edgePadding;
    const top = bounds.minY - edgePadding;
    roomContext.translate(-left, -top);
    drawRoomContents(roomContext, office);
    cached = { canvas, left, top };
    roomBuffers.set(office, cached);
  }
  context.drawImage(cached.canvas, cached.left, cached.top);
}
