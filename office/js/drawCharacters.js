import { polygon } from './pixelArt.js';
import { drawSprite } from './sprites.js';

const CHARACTER_WIDTH = 52;
const CHARACTER_HEIGHT = 120;
const SEATED_BODY_HEIGHT = 86;

export function drawCharacter(context, x, y, staffId, seated, bob) {
  context.save();
  context.translate(Math.round(x), Math.round(y + bob));
  if (!seated) {
    polygon(context, [[-24, 0], [0, -10], [28, 0], [0, 10]],
      '#00000030', null);
  }
  if (seated) {
    context.beginPath();
    context.rect(-32, -CHARACTER_HEIGHT, 64, SEATED_BODY_HEIGHT);
    context.clip();
  }
  drawSprite(context, staffId, -CHARACTER_WIDTH / 2, -CHARACTER_HEIGHT,
    CHARACTER_WIDTH, CHARACTER_HEIGHT);
  context.restore();
}

export function drawNoshSilhouette(context, x, y, phase) {
  drawCharacter(context, x, y, 'nosh',
    false, Math.sin(phase) * 3);
}

export function drawNpcSilhouette(
  context, x, y, staffId, seconds, reduceMotion, seated = false
) {
  const bob = reduceMotion || seated ? 0 : Math.sin(seconds * 1.6) * 1.4;
  drawCharacter(context, x, y, staffId, seated, bob);
}

export function drawPortrait(canvas, staffId) {
  const portraitSize = 192;
  canvas.width = portraitSize;
  canvas.height = portraitSize;
  drawSprite(canvas.getContext('2d'), `${staffId}-portrait`,
    0, 0, portraitSize, portraitSize);
}
