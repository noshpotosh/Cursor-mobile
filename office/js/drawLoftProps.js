import { Paint, rect, line, label } from './pixelArt.js';
import { drawSprite } from './sprites.js';

const BUBBLER_WIDTH = 28;
const BUBBLER_HEIGHT = 56;
const COFFEE_WIDTH = 36;
const COFFEE_HEIGHT = 48;
const WHITEBOARD_WIDTH = 48;
const WHITEBOARD_HEIGHT = 52;

export function drawBubbler(context, x, y) {
  drawSprite(context, 'bubbler',
    x - BUBBLER_WIDTH / 2, y - BUBBLER_HEIGHT,
    BUBBLER_WIDTH, BUBBLER_HEIGHT);
}

export function drawCoffee(context, x, y, seconds, reduceMotion) {
  drawSprite(context, 'coffee',
    x - COFFEE_WIDTH / 2, y - COFFEE_HEIGHT,
    COFFEE_WIDTH, COFFEE_HEIGHT);
  const drift = reduceMotion ? 0 : Math.round(Math.sin(seconds * 2));
  line(context, [[x + 6, y - 22], [x + 5 + drift, y - 26],
    [x + 7, y - 29]], '#e9dcc4', 1);
}

export function drawWhiteboard(context, x, y) {
  drawSprite(context, 'whiteboard',
    x - WHITEBOARD_WIDTH / 2, y - WHITEBOARD_HEIGHT,
    WHITEBOARD_WIDTH, WHITEBOARD_HEIGHT);
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
