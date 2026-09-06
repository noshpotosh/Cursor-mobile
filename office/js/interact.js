import {
  BUBBLER_DRINK_LINE,
  COFFEE_SIP_LINE,
  FurnitureKind,
  INTERACT_RANGE_TILES,
  InteractKind,
  StaffTalkLine,
  WHITEBOARD_NOTES,
} from "./constants.js";

let whiteboardNoteIndex = 0;

function chebyshevDistance(ax, ay, bx, by) {
  return Math.max(Math.abs(ax - bx), Math.abs(ay - by));
}

function nextWhiteboardNote() {
  const note = WHITEBOARD_NOTES[whiteboardNoteIndex];
  whiteboardNoteIndex =
    (whiteboardNoteIndex + 1) % WHITEBOARD_NOTES.length;

  return note;
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

function buildCoffeeTarget(piece) {
  return {
    kind: InteractKind.SIP_COFFEE,
    pieceId: piece.id,
    staffId: null,
    prompt: "Press E to pour a coffee",
    toastText: COFFEE_SIP_LINE,
  };
}

function buildWhiteboardTarget(piece) {
  return {
    kind: InteractKind.READ_BOARD,
    pieceId: piece.id,
    staffId: null,
    prompt: "Press E to read the whiteboard",
    toastText: null,
    readNote: nextWhiteboardNote,
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

    if (piece.kind === FurnitureKind.COFFEE) {
      target = buildCoffeeTarget(piece);
    }

    if (piece.kind === FurnitureKind.WHITEBOARD) {
      target = buildWhiteboardTarget(piece);
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

export function findFurnitureAt(office, gridX, gridY) {
  for (const piece of office.furniture) {
    if (piece.gridX === gridX && piece.gridY === gridY) {
      return piece;
    }
  }

  return null;
}

export function buildInteractTargetForPiece(
  piece,
  staffLookup
) {
  if (piece.kind === FurnitureKind.BUBBLER) {
    return buildDrinkTarget(piece);
  }

  if (piece.kind === FurnitureKind.COFFEE) {
    return buildCoffeeTarget(piece);
  }

  if (piece.kind === FurnitureKind.WHITEBOARD) {
    return buildWhiteboardTarget(piece);
  }

  if (piece.kind !== FurnitureKind.DESK) {
    return null;
  }

  if (piece.isPlayerDesk) {
    return buildUsePcTarget(piece);
  }

  if (!piece.staffId) {
    return null;
  }

  const person = staffLookup[piece.staffId];

  if (!person) {
    return null;
  }

  return buildTalkTarget(piece, person);
}
