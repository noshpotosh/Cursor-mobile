import {
  BUBBLER_DRINK_LINE,
  FurnitureKind,
  INTERACT_RANGE_TILES,
  InteractKind,
  StaffTalkLine,
} from "./constants.js";

function chebyshevDistance(ax, ay, bx, by) {
  return Math.max(Math.abs(ax - bx), Math.abs(ay - by));
}

function buildTalkTarget(piece, person) {
  const line =
    StaffTalkLine[person.id] || person.about;

  return {
    kind: InteractKind.TALK,
    pieceId: piece.id,
    staffId: person.id,
    prompt: `Press E to talk to ${person.displayName}`,
    toastText: `${person.displayName}: “${line}”`,
  };
}

function buildDrinkTarget(piece) {
  return {
    kind: InteractKind.DRINK,
    pieceId: piece.id,
    staffId: null,
    prompt: "Press E to drink from the bubbler",
    toastText: BUBBLER_DRINK_LINE,
  };
}

function buildUsePcTarget(piece) {
  return {
    kind: InteractKind.USE_PC,
    pieceId: piece.id,
    staffId: null,
    prompt: "Press E to use your desk PC",
    toastText: null,
  };
}

export function findNearbyInteractable(
  player,
  office,
  staffLookup
) {
  const playerX = Math.round(player.gridX);
  const playerY = Math.round(player.gridY);
  let bestTarget = null;
  let bestDistance = Infinity;

  for (const piece of office.furniture) {
    const distance = chebyshevDistance(
      playerX,
      playerY,
      piece.gridX,
      piece.gridY
    );

    if (distance < 1 || distance > INTERACT_RANGE_TILES) {
      continue;
    }

    let target = null;

    if (piece.kind === FurnitureKind.BUBBLER) {
      target = buildDrinkTarget(piece);
    }

    if (piece.kind === FurnitureKind.DESK) {
      if (piece.isPlayerDesk) {
        target = buildUsePcTarget(piece);
      } else if (piece.staffId) {
        const person = staffLookup[piece.staffId];

        if (person) {
          target = buildTalkTarget(piece, person);
        }
      }
    }

    if (!target) {
      continue;
    }

    if (distance < bestDistance) {
      bestTarget = target;
      bestDistance = distance;
    }
  }

  return bestTarget;
}
