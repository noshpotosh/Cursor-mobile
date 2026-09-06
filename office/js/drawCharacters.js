import { polygon } from './pixelArt.js';
import { drawSprite } from './sprites.js';

const CHARACTER_WIDTH = 34;
const CHARACTER_HEIGHT = 56;
const SEATED_BODY_HEIGHT = 40;

export function drawCharacter(context, x, y, staffId, seated, bob) {
  context.save();
  context.translate(Math.round(x), Math.round(y + bob));
  if (!seated) {
    polygon(context, [[-14, 0], [0, -5], [16, 0], [0, 5]],
      '#00000030', null);
  }
  if (seated) {
    context.beginPath();
    context.rect(-20, -CHARACTER_HEIGHT, 40, SEATED_BODY_HEIGHT);
    context.clip();
  }
  drawSprite(context, staffId, -CHARACTER_WIDTH / 2, -CHARACTER_HEIGHT,
    CHARACTER_WIDTH, CHARACTER_HEIGHT);
  context.restore();
}

export function drawNoshSilhouette(context, x, y, phase) {
  drawCharacter(context, x, y, 'nosh',
    false, Math.sin(phase) * 1.5);
}

export function drawNpcSilhouette(
  context, x, y, staffId, seconds, reduceMotion, seated = false
) {
  const bob = reduceMotion || seated ? 0 : Math.sin(seconds * 1.6) * 0.7;
  drawCharacter(context, x, y, staffId, seated, bob);
}

export function drawPortrait(canvas, staffId) {
  const portraitSize = 96;
  canvas.width = portraitSize;
  canvas.height = portraitSize;
  drawSprite(canvas.getContext('2d'), `${staffId}-portrait`,
    0, 0, portraitSize, portraitSize);
}
