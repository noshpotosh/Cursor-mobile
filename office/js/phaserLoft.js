import {
  FurnitureKind,
  TILE_HEIGHT_PX,
  TILE_WIDTH_PX,
} from "./constants.js";
import { buildRoomView, gridToScreen, screenToGrid } from "./isoMath.js";
import { isPlayerMoving } from "./player.js";
import {
  SINGLE_SPRITES,
  SPRITE_SHEETS,
  spriteAssetUrl,
} from "./sprites.js";

const STAGE_FILL = "#242521";
const PATH_MARKER = 0xd97706;
const DOOR_TEXTURE_KEY = "door-marker";

const CHARACTER_WIDTH = 52;
const CHARACTER_HEIGHT = 120;
const DESK_WIDTH = 128;
const DESK_HEIGHT = 128;
const PROP_SIZE = 128;
const DOOR_WIDTH = 56;
const DOOR_HEIGHT = 96;

const FURNITURE_TEXTURE = {
  [FurnitureKind.DESK]: "desk-with-monitor",
  [FurnitureKind.BUBBLER]: "bubbler-pixellab",
  [FurnitureKind.COFFEE]: "coffee-pixellab",
  [FurnitureKind.WHITEBOARD]: "whiteboard-pixellab",
  [FurnitureKind.DOOR]: DOOR_TEXTURE_KEY,
};

function ensureDoorTexture(scene) {
  if (scene.textures.exists(DOOR_TEXTURE_KEY)) {
    return;
  }

  const width = 48;
  const height = 80;
  const graphics = scene.make.graphics({ x: 0, y: 0 });

  graphics.fillStyle(0x3a3228, 1);
  graphics.fillRect(0, 0, width, height);
  graphics.fillStyle(0x6b5340, 1);
  graphics.fillRect(4, 4, width - 8, height - 8);
  graphics.fillStyle(0xd7ae67, 1);
  graphics.fillCircle(width - 14, height / 2, 4);
  graphics.generateTexture(DOOR_TEXTURE_KEY, width, height);
  graphics.destroy();
}

function requirePhaser() {
  const Phaser = window.Phaser;

  if (!Phaser) {
    throw new Error("Phaser failed to load");
  }

  return Phaser;
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

      for (const entry of SINGLE_SPRITES) {
        this.load.image(entry.id, spriteAssetUrl(entry.path));
      }
    }

    create() {
      registerAtlasFrames(this.textures);
      ensureDoorTexture(this);
      this.cameras.main.setBackgroundColor(STAGE_FILL);
      this.worldRoot = this.add.container(0, 0);
      this.floorLayer = this.add.container(0, 0);
      this.worldRoot.add(this.floorLayer);
      this.pathMarker = this.add.graphics();
      this.worldRoot.add(this.pathMarker);
      this.entityLayer = this.add.container(0, 0);
      this.worldRoot.add(this.entityLayer);
      this.entitySprites = new Map();
      this.floorTiles = [];

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
      for (const tile of this.floorTiles) {
        tile.destroy();
      }

      this.floorTiles = [];

      for (let gridY = 0; gridY < office.gridHeight; gridY += 1) {
        for (let gridX = 0; gridX < office.gridWidth; gridX += 1) {
          const point = gridToScreen(gridX, gridY);
          const onBorder =
            gridX === 0
            || gridY === 0
            || gridX === office.gridWidth - 1
            || gridY === office.gridHeight - 1;
          const key = onBorder ? "floor-wood" : "floor-carpet";
          const tile = this.add.image(
            point.screenX,
            point.screenY,
            key
          );

          tile.setOrigin(0.5, 0.5);
          tile.setDisplaySize(TILE_WIDTH_PX, TILE_HEIGHT_PX);
          this.floorLayer.add(tile);
          this.floorTiles.push(tile);
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
        const textureKey = FURNITURE_TEXTURE[piece.kind];

        if (!textureKey) {
          continue;
        }

        let size = PROP_SIZE;

        if (piece.kind === FurnitureKind.DESK) {
          size = DESK_WIDTH;
        }

        if (piece.kind === FurnitureKind.DOOR) {
          size = DOOR_WIDTH;
        }

        const drawHeight =
          piece.kind === FurnitureKind.DOOR
            ? DOOR_HEIGHT
            : size;

        wantedIds.add(id);
        this.upsertImage(
          id,
          piece.gridX,
          piece.gridY,
          textureKey,
          null,
          size,
          drawHeight
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
        this.upsertImage(
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
        this.upsertImage(
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
          ? Math.sin(shell.player.walkBobPhase) * 3
          : 0;

      wantedIds.add("player:nosh");
      this.upsertImage(
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
      this.pathMarker.lineStyle(2, 0xd7ae67, 1);
      this.pathMarker.beginPath();
      this.pathMarker.moveTo(point.screenX, point.screenY - 22);
      this.pathMarker.lineTo(point.screenX + 44, point.screenY);
      this.pathMarker.lineTo(point.screenX, point.screenY + 22);
      this.pathMarker.lineTo(point.screenX - 44, point.screenY);
      this.pathMarker.closePath();
      this.pathMarker.fillPath();
      this.pathMarker.strokePath();
    }

    upsertImage(
      id,
      gridX,
      gridY,
      textureKey,
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
        sprite = frame
          ? this.add.image(0, 0, textureKey, frame)
          : this.add.image(0, 0, textureKey);
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
