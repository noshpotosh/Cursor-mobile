import {
  DEFAULT_NPC_JACKET_FILL,
  FurnitureKind,
  NpcJacketFill,
  PLAYER_STAFF_ID,
} from "./constants.js";

export function createNpcs(office, staffLookup) {
  const npcs = [];

  for (const piece of office.furniture) {
    if (piece.kind !== FurnitureKind.DESK) {
      continue;
    }

    if (piece.isPlayerDesk) {
      continue;
    }

    const person = staffLookup[piece.staffId];

    if (!person || person.id === PLAYER_STAFF_ID) {
      continue;
    }

    const jacketFill =
      NpcJacketFill[person.id] || DEFAULT_NPC_JACKET_FILL;

    npcs.push({
      staffId: person.id,
      displayName: person.displayName,
      gridX: piece.gridX,
      gridY: piece.gridY,
      deskId: piece.id,
      jacketFill,
    });
  }

  return npcs;
}
