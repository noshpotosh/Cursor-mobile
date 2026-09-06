import { UpgradeId } from './constants.js';
import { Paint, polygon, rect, line, drawPlant } from './pixelArt.js';
import { drawSprite } from './sprites.js';

export function drawDeskPlant(context, centerX, centerY) {
  drawPlant(context, centerX + 26, centerY - 14, 0.5);
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
  const sprite = betterChairs ? 'chair-better' : 'chair';
  const height = betterChairs ? 49 : 43;
  drawSprite(context, sprite, x + 11, y + 32 - height, 31, height);
}

export function drawDesk(context, x, y, isPlayerDesk, upgrades) {
  context.save();
  context.translate(Math.round(x), Math.round(y));
  polygon(context, [[-45, 8], [3, -15], [50, 8], [1, 33]],
    '#00000025', null);
  drawSprite(context, 'desk', -49, -70, 98, 94);
  if (isPlayerDesk) rect(context, 9, -42, 3, 3, '#e9ae46');
  if (upgrades[UpgradeId.DESK_PLANTS]) drawDeskPlant(context, 0, 0);
  if (upgrades[UpgradeId.DESK_LAMPS]) drawDeskLamp(context, 0, 0);
  context.restore();
}
