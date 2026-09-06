import { UpgradeId } from './constants.js';
import { Paint, polygon, rect, line, drawPlant } from './pixelArt.js';
import { drawSprite } from './sprites.js';

export function drawDeskPlant(context, centerX, centerY) {
  drawPlant(context, centerX + 52, centerY - 28, 1.0);
}

export function drawDeskLamp(context, centerX, centerY) {
  context.save();
  context.translate(centerX - 54, centerY - 48);
  polygon(context, [[-24, 32], [18, 50], [44, 30], [0, 10]],
    '#d9ab63', null);
  rect(context, -10, 14, 24, 6, Paint.ink);
  line(context, [[2, 16], [2, -34], [18, -46], [30, -42]],
    Paint.ink, 6);
  polygon(context, [[20, -46], [32, -46], [42, -30], [14, -30]],
    Paint.chair);
  rect(context, 18, -30, 20, 4, '#ffe3a1');
  context.restore();
}

export function drawDeskChair(context, x, y, betterChairs) {
  if (betterChairs) {
    drawSprite(context, 'chair-better', x + 22, y - 34, 62, 98);
  } else {
    drawSprite(context, 'chair-pixellab', x - 64, y - 64, 128, 128);
  }
}

export function drawDesk(context, x, y, isPlayerDesk, upgrades) {
  context.save();
  context.translate(Math.round(x), Math.round(y));
  polygon(context, [[-90, 16], [6, -30], [100, 16], [2, 66]],
    '#00000025', null);
  drawSprite(context, 'desk-with-monitor', -64, -128, 128, 128);
  if (isPlayerDesk) rect(context, 18, -84, 6, 6, '#e9ae46');
  if (upgrades[UpgradeId.DESK_PLANTS]) drawDeskPlant(context, 0, 0);
  if (upgrades[UpgradeId.DESK_LAMPS]) drawDeskLamp(context, 0, 0);
  context.restore();
}
