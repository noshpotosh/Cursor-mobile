import { UpgradeId } from './constants.js';
import { Paint, polygon, rect, line, drawPlant } from './pixelArt.js';
import { drawSprite } from './sprites.js';

const DESK_WIDTH = 80;
const DESK_HEIGHT = 70;
const CHAIR_BASIC_WIDTH = 28;
const CHAIR_BASIC_HEIGHT = 36;
const CHAIR_BETTER_WIDTH = 30;
const CHAIR_BETTER_HEIGHT = 40;

export function drawDeskPlant(context, centerX, centerY) {
  drawPlant(context, centerX + 26, centerY - 14);
}

export function drawDeskLamp(context, centerX, centerY) {
  context.save();
  context.translate(centerX - 27, centerY - 24);
  polygon(context, [[-12, 16], [9, 25], [22, 15], [0, 5]],
    '#d9ab63', null);
  rect(context, -5, 7, 12, 3, Paint.ink);
  line(context, [[1, 8], [1, -17], [9, -23], [15, -21]],
    Paint.ink, 3);
  polygon(context, [[10, -23], [16, -23], [21, -15], [7, -15]],
    Paint.chair);
  rect(context, 9, -15, 10, 2, '#ffe3a1');
  context.restore();
}

export function drawDeskChair(context, x, y, betterChairs) {
  const width = betterChairs
    ? CHAIR_BETTER_WIDTH
    : CHAIR_BASIC_WIDTH;
  const height = betterChairs
    ? CHAIR_BETTER_HEIGHT
    : CHAIR_BASIC_HEIGHT;
  const sprite = betterChairs ? 'chair-better' : 'chair';

  // Seat sits just south-east of the desk tile origin.
  drawSprite(context, sprite,
    x + 12, y + 28 - height, width, height);
}

export function drawDesk(context, x, y, isPlayerDesk, upgrades) {
  context.save();
  context.translate(Math.round(x), Math.round(y));
  polygon(context, [[-36, 6], [2, -12], [40, 6], [1, 24]],
    '#00000025', null);
  drawSprite(context, 'desk',
    -DESK_WIDTH / 2, -DESK_HEIGHT, DESK_WIDTH, DESK_HEIGHT);
  if (isPlayerDesk) rect(context, 8, -38, 3, 3, '#e9ae46');
  if (upgrades[UpgradeId.DESK_PLANTS]) drawDeskPlant(context, 0, 0);
  if (upgrades[UpgradeId.DESK_LAMPS]) drawDeskLamp(context, 0, 0);
  context.restore();
}
