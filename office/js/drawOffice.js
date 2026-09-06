import { FurnitureKind, UpgradeId } from './constants.js';
import { drawDesk, drawDeskChair } from './drawDeskKit.js';
import {
  drawAmberNeon, drawBubbler, drawCoffee, drawNameplate, drawWhiteboard,
} from './drawLoftProps.js';
import { drawNoshSilhouette, drawNpcSilhouette } from './drawCharacters.js';
import { buildRoomView, gridToScreen } from './isoMath.js';
import { isPlayerMoving, playerPathTarget } from './player.js';
import { drawRoom } from './drawRoom.js';
import { polygon } from './pixelArt.js';

const sceneBuffers = new WeakMap();

function drawFurniture(context, piece, staff, npcs, upgrades, time, reduced) {
  const { screenX: x, screenY: y } = gridToScreen(piece.gridX, piece.gridY);
  if (piece.kind === FurnitureKind.BUBBLER) drawBubbler(context, x, y);
  if (piece.kind === FurnitureKind.COFFEE) {
    drawCoffee(context, x, y, time, reduced);
  }
  if (piece.kind === FurnitureKind.WHITEBOARD) drawWhiteboard(context, x, y);
  if (piece.kind !== FurnitureKind.DESK) return;

  drawDesk(context, x, y, piece.isPlayerDesk, upgrades);
  const occupant = npcs.find(npc => npc.deskId === piece.id && npc.atDesk);
  if (occupant) {
    drawNpcSilhouette(context, x + 48, y + 16, occupant.staffId,
      time, reduced, true);
  }
  drawDeskChair(context, x, y, upgrades[UpgradeId.BETTER_CHAIRS]);
  drawNameplate(context, x - 48, y,
    staff[piece.staffId]?.displayName || piece.id, piece.isPlayerDesk);
}

function drawEntities(context, office, staff, player, npcs, upgrades,
  time, reduced) {
  const drawables = office.furniture.map(piece => ({
    depth: piece.gridX + piece.gridY,
    draw: () => drawFurniture(context, piece, staff, npcs,
      upgrades, time, reduced),
  }));
  for (const npc of npcs.filter(person => !person.atDesk)) {
    const point = gridToScreen(npc.gridX, npc.gridY);
    drawables.push({
      depth: npc.gridX + npc.gridY,
      draw: () => drawNpcSilhouette(context, point.screenX, point.screenY,
        npc.staffId, time, reduced),
    });
  }
  const point = gridToScreen(player.gridX, player.gridY);
  const phase = isPlayerMoving(player) && !reduced ? player.walkBobPhase : 0;
  drawables.push({
    depth: player.gridX + player.gridY,
    draw: () => drawNoshSilhouette(context, point.screenX, point.screenY,
      phase),
  });
  drawables.sort((left, right) => left.depth - right.depth);
  drawables.forEach(drawable => drawable.draw());
}

export function drawOffice(canvas, office, staff, player, npcs,
  viewWidth, viewHeight, upgrades = {}, time = 0) {
  const output = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const view = buildRoomView(office.gridWidth, office.gridHeight,
    viewWidth, viewHeight);
  let buffer = sceneBuffers.get(canvas);
  if (!buffer) {
    buffer = document.createElement('canvas');
    sceneBuffers.set(canvas, buffer);
  }
  const pixelWidth = Math.ceil(viewWidth / view.scale);
  const pixelHeight = Math.ceil(viewHeight / view.scale);
  if (buffer.width !== pixelWidth || buffer.height !== pixelHeight) {
    buffer.width = pixelWidth;
    buffer.height = pixelHeight;
  }
  const context = buffer.getContext('2d');
  context.clearRect(0, 0, pixelWidth, pixelHeight);
  context.fillStyle = '#242521';
  context.fillRect(0, 0, pixelWidth, pixelHeight);
  context.save();
  context.translate(view.originX / view.scale, view.originY / view.scale);
  drawRoom(context, office);
  if (upgrades[UpgradeId.AMBER_NEON]) drawAmberNeon(context, office);
  if (isPlayerMoving(player)) {
    const target = playerPathTarget(player);
    const { screenX: x, screenY: y } = gridToScreen(target.gridX, target.gridY);
    polygon(context, [[x, y - 22], [x + 44, y], [x, y + 22], [x - 44, y]],
      '#d9770630', '#d7ae67');
  }
  drawEntities(context, office, staff, player, npcs, upgrades, time, reduced);
  context.restore();
  output.imageSmoothingEnabled = false;
  output.drawImage(buffer, 0, 0,
    pixelWidth * view.scale, pixelHeight * view.scale);
  return view;
}
