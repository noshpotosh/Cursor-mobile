import { PLAYER_MOVE_TILES_PER_SECOND } from "./constants.js";
import { findPath } from "./pathfind.js";

export function createPlayer(gridX, gridY) {
  return {
    gridX,
    gridY,
    path: [],
    walkBobPhase: 0,
  };
}

export function playerPathTarget(player) {
  if (player.path.length === 0) {
    return null;
  }

  return player.path[player.path.length - 1];
}

export function isPlayerMoving(player) {
  return player.path.length > 0;
}

export function requestPlayerWalk(player, walkMap, goalX, goalY) {
  const startX = Math.round(player.gridX);
  const startY = Math.round(player.gridY);
  const path = findPath(walkMap, startX, startY, goalX, goalY);

  player.path = path;
}

export function updatePlayer(player, deltaSeconds) {
  if (player.path.length === 0) {
    player.walkBobPhase = 0;
    return;
  }

  const nextStep = player.path[0];
  const deltaX = nextStep.gridX - player.gridX;
  const deltaY = nextStep.gridY - player.gridY;
  const distance = Math.hypot(deltaX, deltaY);
  const stepBudget =
    PLAYER_MOVE_TILES_PER_SECOND * deltaSeconds;

  player.walkBobPhase += deltaSeconds * 10;

  if (distance <= stepBudget) {
    player.gridX = nextStep.gridX;
    player.gridY = nextStep.gridY;
    player.path.shift();
    return;
  }

  const moveRatio = stepBudget / distance;
  player.gridX += deltaX * moveRatio;
  player.gridY += deltaY * moveRatio;
}
