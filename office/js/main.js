import { TOAST_VISIBLE_MS } from "./constants.js";
import { drawOffice } from "./drawOffice.js";
import { findNearbyInteractable } from "./interact.js";
import { buildRoomOrigin, screenToGrid } from "./isoMath.js";
import {
  loadStarterOfficeBundle,
  staffById,
} from "./loadOfficeData.js";
import { createNpcs } from "./npcs.js";
import {
  createPlayer,
  requestPlayerWalk,
  updatePlayer,
} from "./player.js";
import {
  buildWalkMap,
  findSpawnNearPlayerDesk,
  isWalkable,
} from "./walkMap.js";

function showLoadError(message) {
  const title = document.querySelector(".office-title");

  if (!title) {
    return;
  }

  title.textContent = message;
}

function sizeCanvasToStage(canvas, stage) {
  const width = stage.clientWidth;
  const height = stage.clientHeight;
  const pixelRatio = window.devicePixelRatio || 1;

  canvas.width = Math.floor(width * pixelRatio);
  canvas.height = Math.floor(height * pixelRatio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const context = canvas.getContext("2d");
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function readClickInStage(event, stage) {
  const bounds = stage.getBoundingClientRect();

  return {
    clickX: event.clientX - bounds.left,
    clickY: event.clientY - bounds.top,
  };
}

function setPromptText(promptEl, text) {
  if (!promptEl) {
    return;
  }

  if (!text) {
    promptEl.hidden = true;
    promptEl.textContent = "";
    return;
  }

  promptEl.hidden = false;
  promptEl.textContent = text;
}

function showToast(toastEl, text) {
  if (!toastEl) {
    return null;
  }

  toastEl.hidden = false;
  toastEl.textContent = text;

  return window.setTimeout(() => {
    toastEl.hidden = true;
    toastEl.textContent = "";
  }, TOAST_VISIBLE_MS);
}

async function startOfficeShell() {
  const stage = document.getElementById("office-stage");
  const canvas = document.getElementById("office-canvas");
  const promptEl = document.getElementById("interact-prompt");
  const toastEl = document.getElementById("office-toast");

  if (!stage || !canvas) {
    throw new Error("Missing office stage or canvas");
  }

  const { office, staff } = await loadStarterOfficeBundle();
  const staffLookup = staffById(staff);
  const walkMap = buildWalkMap(office);
  const spawn = findSpawnNearPlayerDesk(office, walkMap);
  const player = createPlayer(spawn.gridX, spawn.gridY);
  const npcs = createNpcs(office, staffLookup);
  const title = document.querySelector(".office-title");

  if (title && office.displayName) {
    title.textContent = `Warewolf · ${office.displayName}`;
  }

  let lastFrameMs = performance.now();
  let roomOrigin = { originX: 0, originY: 0 };
  let nearbyTarget = null;
  let toastTimerId = null;

  function renderFrame(nowMs) {
    const deltaSeconds = Math.min(
      (nowMs - lastFrameMs) / 1000,
      0.05
    );
    lastFrameMs = nowMs;

    updatePlayer(player, deltaSeconds);
    nearbyTarget = findNearbyInteractable(
      player,
      office,
      staffLookup
    );
    setPromptText(
      promptEl,
      nearbyTarget ? nearbyTarget.prompt : ""
    );
    sizeCanvasToStage(canvas, stage);

    roomOrigin = drawOffice(
      canvas,
      office,
      staffLookup,
      player,
      npcs,
      stage.clientWidth,
      stage.clientHeight
    );

    window.requestAnimationFrame(renderFrame);
  }

  canvas.addEventListener("click", (event) => {
    const { clickX, clickY } = readClickInStage(event, stage);
    const localX = clickX - roomOrigin.originX;
    const localY = clickY - roomOrigin.originY;
    const { gridX, gridY } = screenToGrid(localX, localY);

    if (!isWalkable(walkMap, gridX, gridY)) {
      return;
    }

    requestPlayerWalk(player, walkMap, gridX, gridY);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key !== "e" && event.key !== "E") {
      return;
    }

    if (!nearbyTarget) {
      return;
    }

    if (toastTimerId !== null) {
      window.clearTimeout(toastTimerId);
    }

    toastTimerId = showToast(toastEl, nearbyTarget.toastText);
  });

  // Warm origin before the first paint so early clicks map.
  roomOrigin = buildRoomOrigin(
    office.gridWidth,
    office.gridHeight,
    stage.clientWidth,
    stage.clientHeight
  );

  window.requestAnimationFrame(renderFrame);
}

startOfficeShell().catch((error) => {
  console.error(error);
  showLoadError(
    "Could not load office data. Serve /office over HTTP."
  );
});
