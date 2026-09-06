import { gridToScreen, measureRoomBounds } from './isoMath.js';
import {
  Paint, polygon, rect, line, label, drawPlant, grain,
} from './pixelArt.js';

export const WALL_HEIGHT = 90;
const PLANK_SPACING = 0.5;
const roomBuffers = new WeakMap();

function floorPoint(gridX, gridY) {
  const point = gridToScreen(gridX, gridY);
  return [point.screenX, point.screenY];
}

function drawWoodFloor(context, office) {
  const left = -0.5;
  const right = office.gridWidth - 0.5;
  const bottom = office.gridHeight - 0.5;
  const corners = [floorPoint(left, left), floorPoint(right, left),
    floorPoint(right, bottom), floorPoint(left, bottom)];
  polygon(context, corners.map(([x, y]) => [x, y + 10]), Paint.trim);
  polygon(context, corners, Paint.wood);

  for (let row = left; row < bottom; row += PLANK_SPACING) {
    const nextRow = row + PLANK_SPACING;
    const shade = Math.round(row * 2) % 3 === 0
      ? '#bd8a53' : '#ad7948';
    polygon(context, [floorPoint(left, row), floorPoint(right, row),
      floorPoint(right, nextRow), floorPoint(left, nextRow)],
    shade, '#8b613c');
    for (let col = left; col < right; col += 2) {
      const seam = col + (Math.round(row * 2) % 2) * 0.8;
      line(context, [floorPoint(seam, row), floorPoint(seam, nextRow)],
        '#8b613c');
      line(context, [floorPoint(col + 0.15, row + 0.15),
        floorPoint(Math.min(col + 1.5, right), row + 0.15)],
      '#c4935d');
    }
  }
}

function drawRug(context, office) {
  const left = 2.8;
  const top = 2.7;
  const right = office.gridWidth - 2.5;
  const bottom = office.gridHeight - 2;
  const corners = [floorPoint(left, top), floorPoint(right, top),
    floorPoint(right, bottom), floorPoint(left, bottom)];
  polygon(context, corners, '#d5bd96', '#886445');
  context.save();
  context.clip();
  for (let row = 0; row < bottom - top; row += 1) {
    for (let col = 0; col < right - left; col += 1) {
      const x = left + col;
      const y = top + row;
      polygon(context, [floorPoint(x, y), floorPoint(x + 1, y),
        floorPoint(x + 1, y + 1), floorPoint(x, y + 1)],
      (row + col) % 2 ? '#bc8d67' : '#deca9f', null);
    }
  }
  grain(context, corners, 2500);
  context.restore();
  line(context, [...corners, corners[0]], '#e1caa3', 2);
}

function drawWall(context, start, end, fill) {
  const [startX, startY] = start;
  const [endX, endY] = end;
  polygon(context, [[startX, startY], [endX, endY],
    [endX, endY - WALL_HEIGHT], [startX, startY - WALL_HEIGHT]], fill);
  grain(context, [[startX, startY], [endX, endY],
    [endX, endY - WALL_HEIGHT], [startX, startY - WALL_HEIGHT]], 7000);
  line(context, [[startX, startY - 4], [endX, endY - 4]], Paint.trim, 7);
  line(context, [[startX, startY - 8], [endX, endY - 8]], '#95704c', 2);
  line(context, [[startX, startY - WALL_HEIGHT],
    [endX, endY - WALL_HEIGHT]], Paint.trim, 7);
  line(context, [[startX, startY - WALL_HEIGHT + 4],
    [endX, endY - WALL_HEIGHT + 4]], '#a17e57', 2);
}

function drawPoster(context, x, y, lines, green = false) {
  rect(context, x - 33, y - 26, 66, 52, Paint.trim);
  rect(context, x - 31, y - 24, 62, 48, Paint.woodLight);
  rect(context, x - 28, y - 21, 56, 42,
    green ? '#3b533e' : '#e6d4ae');
  lines.forEach((text, index) => {
    label(context, text, x, y - 11 + index * 11, 10,
      green ? '#ecdcad' : Paint.ink);
  });
}

function drawWallDetails(context, office) {
  // Decorations are mounted in each wall's plane, outside walkable cells.
  context.save();
  context.transform(1, -0.5, 0, 1, -16, -8);
  drawPoster(context, -60, -49, ['SMALL IDEAS', 'BIG IMPACT', '— ✦ —']);
  drawPoster(context, -169, -49, ['COFFEE', '+ FOCUS', '+ KINDNESS'], true);
  rect(context, -126, -28, 33, 5, Paint.woodDark);
  ['#506c66', '#976548', '#c3a372', '#374b53'].forEach((fill, i) => {
    rect(context, -123 + i * 7, -48 + i % 2 * 3, 6, 20, Paint.trim);
    rect(context, -122 + i * 7, -46 + i % 2 * 3, 4, 15, fill);
  });
  context.restore();

  context.save();
  context.transform(1, 0.5, 0, 1, 16, -8);
  drawPoster(context, 81, -49, ['MAKE THINGS', 'PEOPLE LOVE', 'WAREWOLF']);
  const doorX = (office.gridWidth - 1) * 32 - 57;
  rect(context, doorX, -74, 38, 74, Paint.trim);
  rect(context, doorX + 4, -70, 30, 66, '#93633f');
  rect(context, doorX + 8, -64, 22, 36, '#344747');
  polygon(context, [[doorX + 8, -64], [doorX + 30, -64],
    [doorX + 8, -36]], '#607776', null);
  rect(context, doorX + 26, -24, 3, 3, '#e4c58a');
  rect(context, doorX + 6, -87, 26, 10, '#466748');
  label(context, 'EXIT →', doorX + 19, -82, 6, Paint.bone);
  context.restore();
}

function drawRoomContents(context, office) {
  drawWoodFloor(context, office);
  drawRug(context, office);
  grain(context, [floorPoint(-0.5, -0.5),
    floorPoint(office.gridWidth - 0.5, -0.5),
    floorPoint(office.gridWidth - 0.5, office.gridHeight - 0.5),
    floorPoint(-0.5, office.gridHeight - 0.5)], 18000);
  const corner = floorPoint(-0.5, -0.5);
  drawWall(context, floorPoint(-0.5, office.gridHeight - 0.5),
    corner, Paint.wallShade);
  drawWall(context, corner,
    floorPoint(office.gridWidth - 0.5, -0.5), Paint.wall);
  drawWallDetails(context, office);
  const leftPlant = floorPoint(0, office.gridHeight - 1);
  drawPlant(context, leftPlant[0], leftPlant[1]);
  const rightPlant = floorPoint(office.gridWidth - 1, 0);
  drawPlant(context, rightPlant[0], rightPlant[1]);
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
