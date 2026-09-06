import { Paint, rect, line, label } from './pixelArt.js';
import { drawSprite } from './sprites.js';

export function drawBubbler(context, x, y) {
  drawSprite(context, 'bubbler', x - 15, y - 67, 32, 70);
}

export function drawCoffee(context, x, y, seconds, reduceMotion) {
  drawSprite(context, 'coffee', x - 22, y - 52, 44, 61);
  const drift = reduceMotion ? 0 : Math.round(Math.sin(seconds * 2));
  line(context, [[x + 8, y - 26], [x + 7 + drift, y - 30],
    [x + 9, y - 33]], '#e9dcc4', 1);
}

export function drawWhiteboard(context, x, y) {
  drawSprite(context, 'whiteboard', x - 28, y - 60, 56, 64);
}

export function drawNameplate(context, x, y, name, isPlayer = false) {
  const text = isPlayer ? 'NOSH · MY PC' : name.split(' ')[0].toUpperCase();
  context.font = '10px "Pixelify Sans", monospace';
  const width = context.measureText(text).width + 10;
  rect(context, x - width / 2 + 1, y + 11, width, 16, '#49372b60');
  rect(context, x - width / 2, y + 9, width, 15, Paint.woodDark);
  rect(context, x - width / 2 + 1, y + 10, width - 2, 12,
    isPlayer ? '#e6b765' : '#ead8af');
  label(context, text, x, y + 16, 10);
}

export function drawAmberNeon(context, office) {
  const x = (office.gridWidth - office.gridHeight) * 16;
  label(context, 'W A R E W O L F', x, -58, 10, '#d97706');
}
