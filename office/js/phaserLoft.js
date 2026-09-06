import {
  FurnitureKind,
  TILE_HEIGHT_PX,
  TILE_WIDTH_PX,
} from "./constants.js";
import { buildRoomView, gridToScreen, screenToGrid } from "./isoMath.js";
import { isPlayerMoving } from "./player.js";
import { SPRITE_SHEETS, spriteAssetUrl } from "./sprites.js";

const FLOOR_FILL = 0xc9b8a6;
const BORDER_FILL = 0x8b603c;
const STAGE_FILL = "#242521";
const PATH_MARKER = 0xd97706;

const CHARACTER_WIDTH = 26;
const CHARACTER_HEIGHT = 60;
const DESK_WIDTH = 72;
const DESK_HEIGHT = 68;
const PROP_WIDTH = {
  bubbler: 28,
  coffee: 40,
  whiteboard: 48,
};
const PROP_HEIGHT = {
  bubbler: 64,
  coffee: 56,
  whiteboard: 58,
};

const FURNITURE_FRAME = {
  [FurnitureKind.DESK]: "desk",
  [FurnitureKind.BUBBLER]: "bubbler",
  [FurnitureKind.COFFEE]: "coffee",
  [FurnitureKind.WHITEBOARD]: "whiteboard",
};

const FURNITURE_SHEET = {
  desk: "furniture/desk-crt.png",
  bubbler: "furniture/loft-props.png",
  coffee: "furniture/loft-props.png",
  whiteboard: "furniture/loft-props.png",
};

function requirePhaser() {
  const Phaser = window.Phaser;

  if (!Phaser) {
    throw new Error("Phaser failed to load");
  }

  return Phaser;
}

function drawIsoDiamond(graphics, screenX, screenY, fill) {
  const halfWidth = TILE_WIDTH_PX / 2;
  const halfHeight = TILE_HEIGHT_PX / 2;

  graphics.fillStyle(fill, 1);
  graphics.beginPath();
  graphics.moveTo(screenX, screenY - halfHeight);
  graphics.lineTo(screenX + halfWidth, screenY);
  graphics.lineTo(screenX, screenY + halfHeight);
  graphics.lineTo(screenX - halfWidth, screenY);
  graphics.closePath();
  graphics.fillPath();
}

function registerAtlasFrames(textures) {
  for (const sheet of SPRITE_SHEETS) {
    if (!textures.exists(sheet.path)) {
      continue;
    }

    const texture = textures.get(sheet.path);

    for (const [frameId, crop] of Object.entries(sheet.frames)) {
      const [x, y, width, height] = crop;

      if (texture.has(frameId)) {
        continue;
      }

      texture.add(frameId, 0, x, y, width, height);
    }
  }
}

function createLoftScene(Phaser, host) {
  return class LoftScene extends Phaser.Scene {
    constructor() {
      super("loft");
      this.host = host;
      this.roomView = { originX: 0, originY: 0, scale: 1 };
      this.lastWidth = 0;
      this.lastHeight = 0;
    }

    preload() {
      for (const sheet of SPRITE_SHEETS) {
        this.load.image(sheet.path, spriteAssetUrl(sheet.path));
      }
    }

    create() {
      registerAtlasFrames(this.textures);
      this.cameras.main.setBackgroundColor(STAGE_FILL);
      this.worldRoot = this.add.container(0, 0);
      this.floorGraphics = this.add.graphics();
      this.worldRoot.add(this.floorGraphics);
      this.pathMarker = this.add.graphics();
      this.worldRoot.add(this.pathMarker);
      this.entityLayer = this.add.container(0, 0);
      this.worldRoot.add(this.entityLayer);
      this.entitySprites = new Map();

      this.input.on("pointerdown", (pointer) => {
        this.handlePointer(pointer);
      });

      this.rebuildFromShell();
    }

    handlePointer(pointer) {
      const shell = this.host.getShell();

      if (!shell || this.host.isDesktopOpen()) {
        return;
      }

      const localX =
        (pointer.x - this.roomView.originX) / this.roomView.scale;
      const localY =
        (pointer.y - this.roomView.originY) / this.roomView.scale;
      const tile = screenToGrid(localX, localY);

      this.host.onTilePointer(
        tile.gridX,
        tile.gridY,
        localX,
        localY
      );
    }

    rebuildFromShell() {
      const shell = this.host.getShell();

      if (!shell) {
        return;
      }

      this.drawFloor(shell.office);
      this.syncEntities(shell);
      this.fitCamera(shell.office);
    }

    drawFloor(office) {
      this.floorGraphics.clear();

      for (let gridY = 0; gridY < office.gridHeight; gridY += 1) {
        for (let gridX = 0; gridX < office.gridWidth; gridX += 1) {
          const point = gridToScreen(gridX, gridY);
          const onBorder =
            gridX === 0
            || gridY === 0
            || gridX === office.gridWidth - 1
            || gridY === office.gridHeight - 1;
          const fill = onBorder ? BORDER_FILL : FLOOR_FILL;

          drawIsoDiamond(
            this.floorGraphics,
            point.screenX,
            point.screenY,
            fill
          );
        }
      }
    }

    fitCamera(office) {
      const view = buildRoomView(
        office.gridWidth,
        office.gridHeight,
        this.scale.width,
        this.scale.height
      );

      this.roomView = view;
      this.worldRoot.setPosition(view.originX, view.originY);
      this.worldRoot.setScale(view.scale);
    }

    syncEntities(shell) {
      const wantedIds = new Set();
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      for (const piece of shell.office.furniture) {
        const id = `furniture:${piece.id}`;
        const frame = FURNITURE_FRAME[piece.kind];

        wantedIds.add(id);
        this.upsertSprite(
          id,
          piece.gridX,
          piece.gridY,
          FURNITURE_SHEET[frame],
          frame,
          piece.kind === FurnitureKind.DESK
            ? DESK_WIDTH
            : PROP_WIDTH[frame],
          piece.kind === FurnitureKind.DESK
            ? DESK_HEIGHT
            : PROP_HEIGHT[frame]
        );

        if (piece.kind !== FurnitureKind.DESK) {
          continue;
        }

        const occupant = shell.npcs.find(
          (npc) => npc.deskId === piece.id && npc.atDesk
        );

        if (!occupant) {
          continue;
        }

        const seatedId = `npc-seated:${occupant.staffId}`;

        wantedIds.add(seatedId);
        this.upsertSprite(
          seatedId,
          piece.gridX,
          piece.gridY,
          "characters/crew-idle.png",
          occupant.staffId,
          CHARACTER_WIDTH,
          CHARACTER_HEIGHT,
          0.55,
          0.95
        );
      }

      for (const npc of shell.npcs) {
        if (npc.atDesk) {
          continue;
        }

        const id = `npc-walk:${npc.staffId}`;

        wantedIds.add(id);
        this.upsertSprite(
          id,
          npc.gridX,
          npc.gridY,
          "characters/crew-idle.png",
          npc.staffId,
          CHARACTER_WIDTH,
          CHARACTER_HEIGHT
        );
      }

      const bob =
        isPlayerMoving(shell.player) && !reduced
          ? Math.sin(shell.player.walkBobPhase) * 1.5
          : 0;

      wantedIds.add("player:nosh");
      this.upsertSprite(
        "player:nosh",
        shell.player.gridX,
        shell.player.gridY,
        "characters/crew-idle.png",
        "nosh",
        CHARACTER_WIDTH,
        CHARACTER_HEIGHT,
        0.5,
        0.95,
        bob
      );

      this.drawPathMarker(shell, reduced);

      for (const [id, sprite] of this.entitySprites) {
        if (wantedIds.has(id)) {
          continue;
        }

        sprite.destroy();
        this.entitySprites.delete(id);
      }

      this.sortEntities();
    }

    drawPathMarker(shell, reduced) {
      this.pathMarker.clear();

      if (reduced || !isPlayerMoving(shell.player)) {
        return;
      }

      const target = shell.player.path[shell.player.path.length - 1];

      if (!target) {
        return;
      }

      const point = gridToScreen(target.gridX, target.gridY);

      this.pathMarker.fillStyle(PATH_MARKER, 0.2);
      this.pathMarker.lineStyle(1, 0xd7ae67, 1);
      this.pathMarker.beginPath();
      this.pathMarker.moveTo(point.screenX, point.screenY - 11);
      this.pathMarker.lineTo(point.screenX + 22, point.screenY);
      this.pathMarker.lineTo(point.screenX, point.screenY + 11);
      this.pathMarker.lineTo(point.screenX - 22, point.screenY);
      this.pathMarker.closePath();
      this.pathMarker.fillPath();
      this.pathMarker.strokePath();
    }

    upsertSprite(
      id,
      gridX,
      gridY,
      sheetKey,
      frame,
      width,
      height,
      originX = 0.5,
      originY = 0.92,
      bobY = 0
    ) {
      let sprite = this.entitySprites.get(id);
      const point = gridToScreen(gridX, gridY);

      if (!sprite) {
        sprite = this.add.image(0, 0, sheetKey, frame);
        sprite.setOrigin(originX, originY);
        this.entityLayer.add(sprite);
        this.entitySprites.set(id, sprite);
      }

      sprite.setDisplaySize(width, height);
      sprite.setPosition(point.screenX, point.screenY + bobY);
      sprite.setData("depth", gridX + gridY);
    }

    sortEntities() {
      const children = [...this.entitySprites.values()];

      children.sort((left, right) =>
        left.getData("depth") - right.getData("depth"));

      children.forEach((sprite, index) => {
        this.entityLayer.moveTo(sprite, index);
      });
    }

    update(_time, deltaMs) {
      const shell = this.host.getShell();

      if (!shell) {
        return;
      }

      this.host.tick(deltaMs / 1000);
      this.syncEntities(shell);

      const widthChanged = this.scale.width !== this.lastWidth;
      const heightChanged = this.scale.height !== this.lastHeight;

      if (widthChanged || heightChanged) {
        this.lastWidth = this.scale.width;
        this.lastHeight = this.scale.height;
        this.fitCamera(shell.office);
      }
    }
  };
}

export function createPhaserLoft({
  parentEl,
  getShell,
  isDesktopOpen,
  onTilePointer,
  tick,
}) {
  const Phaser = requirePhaser();
  const host = {
    getShell,
    isDesktopOpen,
    onTilePointer,
    tick,
  };

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: parentEl,
    backgroundColor: STAGE_FILL,
    scale: {
      mode: Phaser.Scale.RESIZE,
      width: parentEl.clientWidth || 1280,
      height: parentEl.clientHeight || 720,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    render: {
      pixelArt: true,
      antialias: false,
    },
    scene: [createLoftScene(Phaser, host)],
    banner: false,
  });

  return {
    rebuild() {
      const scene = game.scene.getScene("loft");

      if (scene && scene.rebuildFromShell) {
        scene.rebuildFromShell();
      }
    },
    destroy() {
      game.destroy(true);
    },
  };
}
