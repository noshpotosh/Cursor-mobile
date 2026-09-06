import {
  InteractKind,
  TOAST_VISIBLE_MS,
  UpgradeId,
} from "./constants.js";
import { createAgentBus } from "./agentBus.js";
import {
  createAudioBus,
  playUiBlip,
  toggleAudioMuted,
} from "./audio.js";
import {
  createDesktopOs,
  handleDesktopOsKeydown,
  isDesktopOsOpen,
  openDesktopOs,
} from "./desktopOs.js";
import { drawOffice } from "./drawOffice.js";
import {
  createEconomy,
  formatCompanyBucks,
  ownsUpgrade,
  subscribeEconomy,
} from "./economy.js";
import {
  buildInteractTargetForPiece,
  findFurnitureAt,
  findNearbyInteractable,
} from "./interact.js";
import { buildRoomOrigin, screenToGrid } from "./isoMath.js";
import {
  loadStarterOfficeBundle,
  staffById,
} from "./loadOfficeData.js";
import {
  createNpcs,
  isNpcAtDesk,
  updateNpcs,
} from "./npcs.js";
import {
  createPlayer,
  requestPlayerWalk,
  updatePlayer,
} from "./player.js";
import {
  buildWalkMap,
  findAdjacentWalkable,
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
  if (!toastEl || !text) {
    return null;
  }

  toastEl.hidden = false;
  toastEl.textContent = text;

  return window.setTimeout(() => {
    toastEl.hidden = true;
    toastEl.textContent = "";
  }, TOAST_VISIBLE_MS);
}

function refreshBucksHud(bucksHud, economy) {
  if (!bucksHud) {
    return;
  }

  bucksHud.textContent = formatCompanyBucks(
    economy.companyBucks
  );
}

function refreshMuteButton(muteButton, audio) {
  if (!muteButton) {
    return;
  }

  muteButton.textContent = audio.isMuted ? "Unmute" : "Mute";
  muteButton.setAttribute(
    "aria-pressed",
    audio.isMuted ? "true" : "false"
  );
}

function loftUpgradesFromEconomy(economy) {
  return {
    [UpgradeId.DESK_PLANTS]: ownsUpgrade(
      economy,
      UpgradeId.DESK_PLANTS
    ),
    [UpgradeId.DESK_LAMPS]: ownsUpgrade(
      economy,
      UpgradeId.DESK_LAMPS
    ),
    [UpgradeId.BETTER_CHAIRS]: ownsUpgrade(
      economy,
      UpgradeId.BETTER_CHAIRS
    ),
    [UpgradeId.AMBER_NEON]: ownsUpgrade(
      economy,
      UpgradeId.AMBER_NEON
    ),
  };
}

function buildOccupancyMap(npcs, desktopOpen) {
  const occupancy = {};

  for (const npc of npcs) {
    occupancy[npc.staffId] = isNpcAtDesk(npc);
  }

  occupancy.nosh = desktopOpen;

  return occupancy;
}

function wireDesktopCallbacks(shell) {
  return {
    getOccupancy() {
      return buildOccupancyMap(shell.npcs, true);
    },
    onClose() {
      setPromptText(shell.promptEl, "");
    },
    onGoalComplete(result) {
      shell.showEconomyToast(
        `+${result.rewardBucks} bucks — ${result.title}`
      );
      playUiBlip(shell.audio, "message");
    },
    onUpgradePurchase(result) {
      shell.showEconomyToast(
        `Installed ${result.title} (−${result.costBucks})`
      );
      playUiBlip(shell.audio, "click");
    },
    onOfficeChange(result) {
      shell.applyOfficeLayout(result.officeId);
      shell.showEconomyToast(`Moved into ${result.title}`);
      playUiBlip(shell.audio, "click");
    },
    onMessageSent() {
      playUiBlip(shell.audio, "message");
    },
  };
}

function triggerInteract(shell, target) {
  if (!target) {
    return;
  }

  if (target.kind === InteractKind.USE_PC) {
    openDesktopOs(shell.desktop);
    playUiBlip(shell.audio, "click");
    return;
  }

  if (shell.toastTimerId !== null) {
    window.clearTimeout(shell.toastTimerId);
  }

  let toastText = target.toastText;

  if (target.kind === InteractKind.READ_BOARD) {
    toastText = target.readNote();
  }

  shell.toastTimerId = showToast(shell.toastEl, toastText);

  const drinkLike =
    target.kind === InteractKind.DRINK
    || target.kind === InteractKind.SIP_COFFEE;

  playUiBlip(shell.audio, drinkLike ? "drink" : "click");
}

function handleCanvasClick(event, shell) {
  if (isDesktopOsOpen(shell.desktop)) {
    return;
  }

  const { clickX, clickY } = readClickInStage(
    event,
    shell.stage
  );
  const localX = clickX - shell.roomOrigin.originX;
  const localY = clickY - shell.roomOrigin.originY;
  const { gridX, gridY } = screenToGrid(localX, localY);
  const furniture = findFurnitureAt(
    shell.office,
    gridX,
    gridY
  );

  if (furniture) {
    const target = buildInteractTargetForPiece(
      furniture,
      shell.staffLookup
    );

    if (!target) {
      return;
    }

    const standTile = findAdjacentWalkable(
      shell.walkMap,
      furniture.gridX,
      furniture.gridY
    );

    if (!standTile) {
      return;
    }

    requestPlayerWalk(
      shell.player,
      shell.walkMap,
      standTile.gridX,
      standTile.gridY,
      () => {
        triggerInteract(shell, target);
      }
    );
    return;
  }

  if (!isWalkable(shell.walkMap, gridX, gridY)) {
    return;
  }

  requestPlayerWalk(
    shell.player,
    shell.walkMap,
    gridX,
    gridY
  );
}

function handleOfficeKeydown(event, shell) {
  if (handleDesktopOsKeydown(shell.desktop, event)) {
    return;
  }

  if (event.key === "m" || event.key === "M") {
    toggleAudioMuted(shell.audio);
    refreshMuteButton(shell.muteButton, shell.audio);
    return;
  }

  if (event.key !== "e" && event.key !== "E") {
    return;
  }

  if (!shell.nearbyTarget) {
    return;
  }

  triggerInteract(shell, shell.nearbyTarget);
}

function startRenderLoop(shell) {
  function renderFrame(nowMs) {
    const deltaSeconds = Math.min(
      (nowMs - shell.lastFrameMs) / 1000,
      0.05
    );
    shell.lastFrameMs = nowMs;

    if (!isDesktopOsOpen(shell.desktop)) {
      updatePlayer(shell.player, deltaSeconds);
      updateNpcs(
        shell.npcs,
        shell.office,
        shell.walkMap,
        deltaSeconds
      );
      shell.nearbyTarget = findNearbyInteractable(
        shell.player,
        shell.office,
        shell.staffLookup
      );
      setPromptText(
        shell.promptEl,
        shell.nearbyTarget ? shell.nearbyTarget.prompt : ""
      );
    } else {
      shell.nearbyTarget = null;
      setPromptText(shell.promptEl, "");
    }

    sizeCanvasToStage(shell.canvas, shell.stage);
    shell.roomOrigin = drawOffice(
      shell.canvas,
      shell.office,
      shell.staffLookup,
      shell.player,
      shell.npcs,
      shell.stage.clientWidth,
      shell.stage.clientHeight,
      loftUpgradesFromEconomy(shell.economy)
    );

    window.requestAnimationFrame(renderFrame);
  }

  window.requestAnimationFrame(renderFrame);
}

async function startOfficeShell() {
  const stage = document.getElementById("office-stage");
  const canvas = document.getElementById("office-canvas");
  const promptEl = document.getElementById("interact-prompt");
  const toastEl = document.getElementById("office-toast");
  const desktopRoot = document.getElementById("desktop-os");
  const bucksHud = document.getElementById("bucks-hud");
  const muteButton = document.getElementById("mute-button");

  if (!stage || !canvas || !desktopRoot) {
    throw new Error("Missing office stage, canvas, or desktop");
  }

  const bundle = await loadStarterOfficeBundle();
  const staffLookup = staffById(bundle.staff);
  const economy = createEconomy(
    bundle.goals,
    bundle.upgrades,
    bundle.offices
  );
  const agentBus = createAgentBus(bundle.agentPersonas);
  const audio = createAudioBus();

  let office =
    bundle.layouts[economy.currentOfficeId] || bundle.office;
  let walkMap = buildWalkMap(office);
  let spawn = findSpawnNearPlayerDesk(office, walkMap);
  let player = createPlayer(spawn.gridX, spawn.gridY);
  let npcs = createNpcs(office, staffLookup);
  const title = document.querySelector(".office-title");

  const shell = {
    stage,
    canvas,
    promptEl,
    toastEl,
    bucksHud,
    muteButton,
    staffLookup,
    economy,
    audio,
    office,
    walkMap,
    player,
    npcs,
    desktop: null,
    toastTimerId: null,
    lastFrameMs: performance.now(),
    roomOrigin: { originX: 0, originY: 0 },
    nearbyTarget: null,
    showEconomyToast: null,
    applyOfficeLayout: null,
  };

  function syncOfficeTitle() {
    if (title && shell.office.displayName) {
      title.textContent =
        `Warewolf · ${shell.office.displayName}`;
    }
  }

  shell.showEconomyToast = function showEconomyToast(text) {
    if (shell.toastTimerId !== null) {
      window.clearTimeout(shell.toastTimerId);
    }

    shell.toastTimerId = showToast(toastEl, text);
  };

  shell.applyOfficeLayout = function applyOfficeLayout(
    officeId
  ) {
    const nextOffice = bundle.layouts[officeId];

    if (!nextOffice) {
      return;
    }

    shell.office = nextOffice;
    shell.walkMap = buildWalkMap(shell.office);
    spawn = findSpawnNearPlayerDesk(
      shell.office,
      shell.walkMap
    );
    shell.player = createPlayer(spawn.gridX, spawn.gridY);
    shell.npcs = createNpcs(shell.office, staffLookup);
    syncOfficeTitle();
  };

  syncOfficeTitle();
  refreshBucksHud(bucksHud, economy);
  refreshMuteButton(muteButton, audio);
  subscribeEconomy(economy, () => {
    refreshBucksHud(bucksHud, economy);
  });

  shell.desktop = createDesktopOs({
    root: desktopRoot,
    staffList: bundle.staff,
    economy,
    agentBus,
    ...wireDesktopCallbacks(shell),
  });

  shell.canvas.addEventListener("click", (event) => {
    handleCanvasClick(event, shell);
  });

  window.addEventListener("keydown", (event) => {
    handleOfficeKeydown(event, shell);
  });

  if (muteButton) {
    muteButton.addEventListener("click", () => {
      toggleAudioMuted(audio);
      refreshMuteButton(muteButton, audio);
    });
  }

  if (economy.currentOfficeId !== shell.office.id) {
    shell.applyOfficeLayout(economy.currentOfficeId);
  }

  shell.roomOrigin = buildRoomOrigin(
    shell.office.gridWidth,
    shell.office.gridHeight,
    stage.clientWidth,
    stage.clientHeight
  );

  startRenderLoop(shell);
}

startOfficeShell().catch((error) => {
  console.error(error);
  showLoadError(
    "Could not load office data. Serve /office over HTTP."
  );
});
