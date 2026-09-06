import { PLAYER_MOVE_TILES_PER_SECOND } from "./constants.js";
import { findPath } from "./pathfind.js";

function prefersReducedMotion() {
  return window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
}

export function createPlayer(gridX, gridY) {
  return {
    gridX,
    gridY,
    path: [],
    walkBobPhase: 0,
    onArrive: null,
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

export function requestPlayerWalk(
  player,
  walkMap,
  goalX,
  goalY,
  onArrive
) {
  player.onArrive = onArrive || null;

  if (prefersReducedMotion()) {
    player.gridX = goalX;
    player.gridY = goalY;
    player.path = [];
    player.walkBobPhase = 0;

    if (player.onArrive) {
      const callback = player.onArrive;
      player.onArrive = null;
      callback();
    }

    return;
  }

  const startX = Math.round(player.gridX);
  const startY = Math.round(player.gridY);
  const path = findPath(walkMap, startX, startY, goalX, goalY);

  player.path = path;

  if (path.length === 0 && player.onArrive) {
    const sameTile =
      startX === goalX && startY === goalY;

    if (sameTile) {
      const callback = player.onArrive;
      player.onArrive = null;
      callback();
    } else {
      player.onArrive = null;
    }
  }
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

    if (player.path.length === 0 && player.onArrive) {
      const callback = player.onArrive;
      player.onArrive = null;
      callback();
    }

    return;
  }

  const moveRatio = stepBudget / distance;
  player.gridX += deltaX * moveRatio;
  player.gridY += deltaY * moveRatio;
}
