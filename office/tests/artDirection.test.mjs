import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  buildRoomView, measureRoomBounds, gridToScreen, screenToGrid,
} from '../js/isoMath.js';
import { findFurnitureAtScreen } from '../js/interact.js';
import {
  buildWalkMap, findAdjacentWalkable, findSpawnNearPlayerDesk,
} from '../js/walkMap.js';
import { findPath } from '../js/pathfind.js';

const viewports = [[1280, 720], [1920, 1080], [390, 844], [720, 480]];
for (const layout of ['starter-office', 'pack-office']) {
  const url = new URL(`../data/${layout}.json`, import.meta.url);
  const office = JSON.parse(await readFile(url, 'utf8'));
  test(`${layout}: walls and floor fit with room for the HUD`, () => {
    const bounds = measureRoomBounds(office.gridWidth, office.gridHeight);
    for (const [width, height] of viewports) {
      const view = buildRoomView(office.gridWidth, office.gridHeight,
        width, height);
      assert.ok(view.originX + bounds.minX * view.scale >= 15);
      assert.ok(view.originX + bounds.maxX * view.scale <= width - 15);
      assert.ok(view.originY + bounds.minY * view.scale >= 55);
      assert.ok(view.originY + bounds.maxY * view.scale <= height - 45);
      for (const piece of office.furniture) {
        const point = gridToScreen(piece.gridX, piece.gridY);
        const x = view.originX + point.screenX * view.scale;
        const y = view.originY + point.screenY * view.scale;
        const tile = screenToGrid((x - view.originX) / view.scale,
          (y - view.originY) / view.scale);
        assert.ok(tile.gridX === piece.gridX && tile.gridY === piece.gridY);
      }
    }
  });
  test(`${layout}: raised CRTs select the visible desk`, () => {
    for (const desk of office.furniture.filter(piece => piece.kind === 'desk')) {
      const point = gridToScreen(desk.gridX, desk.gridY);
      const hit = findFurnitureAtScreen(office,
        point.screenX - 6, point.screenY - 48);
      assert.equal(hit?.id, desk.id);
    }
  });
  test(`${layout}: visible prop centers select their own interaction`, () => {
    const props = office.furniture.filter(piece => piece.kind !== 'desk');
    for (const prop of props) {
      const point = gridToScreen(prop.gridX, prop.gridY);
      const hit = findFurnitureAtScreen(office,
        point.screenX, point.screenY - 30);
      assert.equal(hit?.id, prop.id);
    }
  });
  test(`${layout}: every desk and relocated prop stays reachable`, () => {
    const walkMap = buildWalkMap(office);
    const spawn = findSpawnNearPlayerDesk(office, walkMap);
    for (const piece of office.furniture) {
      const adjacent = findAdjacentWalkable(walkMap, piece.gridX, piece.gridY);
      assert.ok(adjacent, `${piece.id} has an interaction tile`);
      const alreadyThere = spawn.gridX === adjacent.gridX
        && spawn.gridY === adjacent.gridY;
      const path = findPath(walkMap, spawn.gridX, spawn.gridY,
        adjacent.gridX, adjacent.gridY);
      assert.ok(alreadyThere || path.length, `${piece.id} is reachable`);
    }
  });
}
