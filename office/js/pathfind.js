import { CARDINAL_STEPS } from "./constants.js";
import { isWalkable } from "./walkMap.js";

function cellKey(gridX, gridY) {
  return `${gridX},${gridY}`;
}

function rebuildPath(cameFrom, startKey, goalKey) {
  const path = [];
  let currentKey = goalKey;

  while (currentKey !== startKey) {
    const [gridXText, gridYText] = currentKey.split(",");
    path.push({
      gridX: Number(gridXText),
      gridY: Number(gridYText),
    });
    currentKey = cameFrom.get(currentKey);
  }

  path.reverse();
  return path;
}

// Cardinal BFS — short loft paths stay readable and cheap.
export function findPath(walkMap, startX, startY, goalX, goalY) {
  const startWalkable = isWalkable(walkMap, startX, startY);
  const goalWalkable = isWalkable(walkMap, goalX, goalY);

  if (!startWalkable || !goalWalkable) {
    return [];
  }

  const startKey = cellKey(startX, startY);
  const goalKey = cellKey(goalX, goalY);

  if (startKey === goalKey) {
    return [];
  }

  const queue = [{ gridX: startX, gridY: startY }];
  const cameFrom = new Map();
  cameFrom.set(startKey, null);

  while (queue.length > 0) {
    const current = queue.shift();
    const currentKey = cellKey(current.gridX, current.gridY);

    if (currentKey === goalKey) {
      return rebuildPath(cameFrom, startKey, goalKey);
    }

    for (const step of CARDINAL_STEPS) {
      const nextX = current.gridX + step.deltaX;
      const nextY = current.gridY + step.deltaY;
      const nextKey = cellKey(nextX, nextY);

      if (cameFrom.has(nextKey)) {
        continue;
      }

      if (!isWalkable(walkMap, nextX, nextY)) {
        continue;
      }

      cameFrom.set(nextKey, currentKey);
      queue.push({ gridX: nextX, gridY: nextY });
    }
  }

  return [];
}
