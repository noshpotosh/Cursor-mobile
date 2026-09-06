import { Paint, rect, line, label } from './pixelArt.js';
import { drawSprite } from './sprites.js';

export function drawBubbler(context, x, y) {
  drawSprite(context, 'bubbler-pixellab', x - 64, y - 128, 128, 128);
}

export function drawCoffee(context, x, y, seconds, reduceMotion) {
  drawSprite(context, 'coffee-pixellab', x - 64, y - 128, 128, 128);
  const drift = reduceMotion ? 0 : Math.round(Math.sin(seconds * 2) * 2);
  line(context, [[x + 16, y - 52], [x + 14 + drift, y - 60],
    [x + 18, y - 66]], '#e9dcc4', 2);
}

export function drawWhiteboard(context, x, y) {
  drawSprite(context, 'whiteboard-pixellab', x - 64, y - 128, 128, 128);
}

export function drawNameplate(context, x, y, name, isPlayer = false) {
  const text = isPlayer ? 'NOSH · MY PC' : name.split(' ')[0].toUpperCase();
  context.font = '20px "Pixelify Sans", monospace';
  const width = context.measureText(text).width + 20;
  rect(context, x - width / 2 + 2, y + 22, width, 32, '#49372b60');
  rect(context, x - width / 2, y + 18, width, 30, Paint.woodDark);
  rect(context, x - width / 2 + 2, y + 20, width - 4, 24,
    isPlayer ? '#e6b765' : '#ead8af');
  label(context, text, x, y + 32, 20);
}

export function drawAmberNeon(context, office) {
  const x = (office.gridWidth - office.gridHeight) * 32;
  label(context, 'W A R E W O L F', x, -116, 20, '#d97706');
}
