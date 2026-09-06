import { drawSprite } from './sprites.js';

// Logical-pixel primitives shared by room sprites and directory portraits.
export const Paint = {
  ink: '#29241f', bone: '#f4efe6', wall: '#d7c1a0',
  wallShade: '#b5a080', wood: '#b17a43', woodLight: '#d09a5e',
  woodDark: '#69452c', trim: '#49372b', sage: '#6b8f71',
  leaf: '#435d39', leafLight: '#879653', pot: '#a75f3b',
  screen: '#243d35', screenText: '#95b878', chair: '#374342',
};

export function rect(context, x, y, width, height, fill) {
  context.fillStyle = fill;
  context.fillRect(x, y, width, height);
}

export function polygon(context, points, fill, outline = Paint.ink) {
  context.beginPath();
  points.forEach(([x, y], index) => {
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  });
  context.closePath();
  context.fillStyle = fill;
  context.fill();
  if (!outline) return;
  context.strokeStyle = outline;
  context.lineWidth = 1;
  context.stroke();
}

export function line(context, points, fill, width = 1) {
  context.beginPath();
  points.forEach(([x, y], index) => {
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  });
  context.strokeStyle = fill;
  context.lineWidth = width;
  context.stroke();
}

export function label(context, text, x, y, size = 8, fill = Paint.ink) {
  context.font = `${size}px "Pixelify Sans", monospace`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = fill;
  context.fillText(text, x, y);
}

const PLANT_WIDTH = 20;
const PLANT_HEIGHT = 28;

export function drawPlant(context, x, y) {
  drawSprite(context, 'plant',
    x - PLANT_WIDTH / 2, y - PLANT_HEIGHT,
    PLANT_WIDTH, PLANT_HEIGHT);
}

const RANDOM_MULTIPLIER = 1664525;
const RANDOM_INCREMENT = 1013904223;
const UINT32_RANGE = 4294967296;

export function grain(context, corners, count, seed = 19) {
  const minX = Math.min(...corners.map(point => point[0]));
  const maxX = Math.max(...corners.map(point => point[0]));
  const minY = Math.min(...corners.map(point => point[1]));
  const maxY = Math.max(...corners.map(point => point[1]));
  context.save();
  polygon(context, corners, '#00000000', null);
  context.clip();
  for (let fleck = 0; fleck < count; fleck += 1) {
    seed = (seed * RANDOM_MULTIPLIER + RANDOM_INCREMENT) >>> 0;
    const x = minX + (seed / UINT32_RANGE) * (maxX - minX);
    seed = (seed * RANDOM_MULTIPLIER + RANDOM_INCREMENT) >>> 0;
    const y = minY + (seed / UINT32_RANGE) * (maxY - minY);
    rect(context, Math.floor(x), Math.floor(y), 1, 1,
      fleck % 2 ? '#3c2f2220' : '#fff3d821');
  }
  context.restore();
}
