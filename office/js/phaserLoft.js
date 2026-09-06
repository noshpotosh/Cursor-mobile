import {
  FurnitureKind,
  TILE_HEIGHT_PX,
  TILE_WIDTH_PX,
} from "./constants.js";
import { buildRoomView, gridToScreen, screenToGrid } from "./isoMath.js";

const FLOOR_FILL = 0xc9b8a6;
const BORDER_FILL = 0x8b603c;
const DESK_FILL = 0x6b5344;
const PROP_FILL = 0x5c6b73;
const PLAYER_FILL = 0xd97706;
const STAGE_FILL = "#242521";

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

  graphics.fillStyle(fill);
  graphics.beginPath();
  graphics.moveTo(screenX, screenY - halfHeight);
  graphics.lineTo(screenX + halfWidth, screenY);
  graphics.lineTo(screenX, screenY + halfHeight);
  graphics.lineTo(screenX - halfWidth, screenY);
  graphics.closePath();
  graphics.fillPath();
}

function furnitureFill(kind) {
  if (kind === FurnitureKind.DESK) {
    return DESK_FILL;
  }

  return PROP_FILL;
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

    create() {
      this.cameras.main.setBackgroundColor(STAGE_FILL);
      this.worldRoot = this.add.container(0, 0);
      this.floorGraphics = this.add.graphics();
      this.worldRoot.add(this.floorGraphics);
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

      for (const piece of shell.office.furniture) {
        const id = `furniture:${piece.id}`;

        wantedIds.add(id);
        this.upsertMarker(
          id,
          piece.gridX,
          piece.gridY,
          furnitureFill(piece.kind),
          piece.kind === FurnitureKind.DESK ? 36 : 28
        );
      }

      wantedIds.add("player:nosh");
      this.upsertMarker(
        "player:nosh",
        shell.player.gridX,
        shell.player.gridY,
        PLAYER_FILL,
        22
      );

      for (const [id, sprite] of this.entitySprites) {
        if (wantedIds.has(id)) {
          continue;
        }

        sprite.destroy();
        this.entitySprites.delete(id);
      }

      this.sortEntities();
    }

    upsertMarker(id, gridX, gridY, fill, size) {
      let sprite = this.entitySprites.get(id);
      const point = gridToScreen(gridX, gridY);

      if (!sprite) {
        sprite = this.add.rectangle(0, 0, size, size, fill);
        sprite.setOrigin(0.5, 0.85);
        this.entityLayer.add(sprite);
        this.entitySprites.set(id, sprite);
      }

      sprite.setPosition(point.screenX, point.screenY);
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
