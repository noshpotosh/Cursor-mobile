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

  function syncOfficeTitle() {
    if (title && office.displayName) {
      title.textContent = `Warewolf · ${office.displayName}`;
    }
  }

  syncOfficeTitle();
  refreshBucksHud(bucksHud, economy);
  refreshMuteButton(muteButton, audio);
  subscribeEconomy(economy, () => {
    refreshBucksHud(bucksHud, economy);
  });

  let toastTimerId = null;

  function showEconomyToast(text) {
    if (toastTimerId !== null) {
      window.clearTimeout(toastTimerId);
    }

    toastTimerId = showToast(toastEl, text);
  }

  function applyOfficeLayout(officeId) {
    const nextOffice = bundle.layouts[officeId];

    if (!nextOffice) {
      return;
    }

    office = nextOffice;
    walkMap = buildWalkMap(office);
    spawn = findSpawnNearPlayerDesk(office, walkMap);
    player = createPlayer(spawn.gridX, spawn.gridY);
    npcs = createNpcs(office, staffLookup);
    syncOfficeTitle();
  }

  const desktop = createDesktopOs({
    root: desktopRoot,
    staffList: bundle.staff,
    economy,
    agentBus,
    getOccupancy() {
      return buildOccupancyMap(npcs, true);
    },
    onClose() {
      setPromptText(promptEl, "");
    },
    onGoalComplete(result) {
      showEconomyToast(
        `+${result.rewardBucks} bucks — ${result.title}`
      );
      playUiBlip(audio, "message");
    },
    onUpgradePurchase(result) {
      showEconomyToast(
        `Installed ${result.title} (−${result.costBucks})`
      );
      playUiBlip(audio, "click");
    },
    onOfficeChange(result) {
      applyOfficeLayout(result.officeId);
      showEconomyToast(`Moved into ${result.title}`);
      playUiBlip(audio, "click");
    },
    onMessageSent() {
      playUiBlip(audio, "message");
    },
  });

  function triggerInteract(target) {
    if (!target) {
      return;
    }

    if (target.kind === InteractKind.USE_PC) {
      openDesktopOs(desktop);
      playUiBlip(audio, "click");
      return;
    }

    if (toastTimerId !== null) {
      window.clearTimeout(toastTimerId);
    }

    let toastText = target.toastText;

    if (target.kind === InteractKind.READ_BOARD) {
      toastText = target.readNote();
    }

    toastTimerId = showToast(toastEl, toastText);

    const drinkLike =
      target.kind === InteractKind.DRINK
      || target.kind === InteractKind.SIP_COFFEE;

    playUiBlip(audio, drinkLike ? "drink" : "click");
  }

  let lastFrameMs = performance.now();
  let roomOrigin = { originX: 0, originY: 0 };
  let nearbyTarget = null;

  function renderFrame(nowMs) {
    const deltaSeconds = Math.min(
      (nowMs - lastFrameMs) / 1000,
      0.05
    );
    lastFrameMs = nowMs;

    if (!isDesktopOsOpen(desktop)) {
      updatePlayer(player, deltaSeconds);
      updateNpcs(npcs, office, walkMap, deltaSeconds);
      nearbyTarget = findNearbyInteractable(
        player,
        office,
        staffLookup
      );
      setPromptText(
        promptEl,
        nearbyTarget ? nearbyTarget.prompt : ""
      );
    } else {
      nearbyTarget = null;
      setPromptText(promptEl, "");
    }

    sizeCanvasToStage(canvas, stage);
    roomOrigin = drawOffice(
      canvas,
      office,
      staffLookup,
      player,
      npcs,
      stage.clientWidth,
      stage.clientHeight,
      loftUpgradesFromEconomy(economy)
    );

    window.requestAnimationFrame(renderFrame);
  }

  canvas.addEventListener("click", (event) => {
    if (isDesktopOsOpen(desktop)) {
      return;
    }

    const { clickX, clickY } = readClickInStage(event, stage);
    const localX = clickX - roomOrigin.originX;
    const localY = clickY - roomOrigin.originY;
    const { gridX, gridY } = screenToGrid(localX, localY);
    const furniture = findFurnitureAt(office, gridX, gridY);

    if (furniture) {
      const target = buildInteractTargetForPiece(
        furniture,
        staffLookup
      );

      if (!target) {
        return;
      }

      const standTile = findAdjacentWalkable(
        walkMap,
        furniture.gridX,
        furniture.gridY
      );

      if (!standTile) {
        return;
      }

      requestPlayerWalk(
        player,
        walkMap,
        standTile.gridX,
        standTile.gridY,
        () => {
          triggerInteract(target);
        }
      );
      return;
    }

    if (!isWalkable(walkMap, gridX, gridY)) {
      return;
    }

    requestPlayerWalk(player, walkMap, gridX, gridY);
  });

  window.addEventListener("keydown", (event) => {
    if (handleDesktopOsKeydown(desktop, event)) {
      return;
    }

    if (event.key === "m" || event.key === "M") {
      toggleAudioMuted(audio);
      refreshMuteButton(muteButton, audio);
      return;
    }

    if (event.key !== "e" && event.key !== "E") {
      return;
    }

    if (!nearbyTarget) {
      return;
    }

    triggerInteract(nearbyTarget);
  });

  if (muteButton) {
    muteButton.addEventListener("click", () => {
      toggleAudioMuted(audio);
      refreshMuteButton(muteButton, audio);
    });
  }

  if (economy.currentOfficeId !== office.id) {
    applyOfficeLayout(economy.currentOfficeId);
  }

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
