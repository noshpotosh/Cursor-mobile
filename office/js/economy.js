import {
  ECONOMY_STORAGE_KEY,
  STARTING_COMPANY_BUCKS,
  STARTER_OFFICE_ID,
} from "./constants.js";

function emptyEconomyState() {
  return {
    companyBucks: STARTING_COMPANY_BUCKS,
    completedGoalIds: [],
    ownedUpgradeIds: [],
    currentOfficeId: STARTER_OFFICE_ID,
    ownedOfficeIds: [STARTER_OFFICE_ID],
    officeHistory: [
      {
        officeId: STARTER_OFFICE_ID,
        displayName: "Starter Loft",
        atMs: Date.now(),
        note: "Day-one loft.",
      },
    ],
  };
}

function readStoredEconomy() {
  try {
    const raw = window.localStorage.getItem(
      ECONOMY_STORAGE_KEY
    );

    if (!raw) {
      return emptyEconomyState();
    }

    const parsed = JSON.parse(raw);
    const empty = emptyEconomyState();
    const companyBucks = Number(parsed.companyBucks);
    const completedGoalIds = Array.isArray(
      parsed.completedGoalIds
    )
      ? parsed.completedGoalIds.filter(
          (id) => typeof id === "string"
        )
      : [];
    const ownedUpgradeIds = Array.isArray(
      parsed.ownedUpgradeIds
    )
      ? parsed.ownedUpgradeIds.filter(
          (id) => typeof id === "string"
        )
      : [];
    const ownedOfficeIds = Array.isArray(parsed.ownedOfficeIds)
      ? parsed.ownedOfficeIds.filter(
          (id) => typeof id === "string"
        )
      : empty.ownedOfficeIds;
    const officeHistory = Array.isArray(parsed.officeHistory)
      ? parsed.officeHistory
      : empty.officeHistory;
    const currentOfficeId =
      typeof parsed.currentOfficeId === "string"
        ? parsed.currentOfficeId
        : STARTER_OFFICE_ID;

    return {
      companyBucks: Number.isFinite(companyBucks)
        ? companyBucks
        : STARTING_COMPANY_BUCKS,
      completedGoalIds,
      ownedUpgradeIds,
      currentOfficeId,
      ownedOfficeIds,
      officeHistory,
    };
  } catch (error) {
    return emptyEconomyState();
  }
}

function writeStoredEconomy(state) {
  window.localStorage.setItem(
    ECONOMY_STORAGE_KEY,
    JSON.stringify({
      companyBucks: state.companyBucks,
      completedGoalIds: state.completedGoalIds,
      ownedUpgradeIds: state.ownedUpgradeIds,
      currentOfficeId: state.currentOfficeId,
      ownedOfficeIds: state.ownedOfficeIds,
      officeHistory: state.officeHistory,
    })
  );
}

export function createEconomy(goals, upgrades, offices) {
  const stored = readStoredEconomy();
  const goalById = {};
  const upgradeById = {};
  const officeById = {};

  for (const goal of goals) {
    goalById[goal.id] = goal;
  }

  for (const upgrade of upgrades) {
    upgradeById[upgrade.id] = upgrade;
  }

  for (const office of offices) {
    officeById[office.id] = office;
  }

  return {
    goals,
    upgrades,
    offices,
    goalById,
    upgradeById,
    officeById,
    companyBucks: stored.companyBucks,
    completedGoalIds: [...stored.completedGoalIds],
    ownedUpgradeIds: [...stored.ownedUpgradeIds],
    currentOfficeId: stored.currentOfficeId,
    ownedOfficeIds: [...stored.ownedOfficeIds],
    officeHistory: stored.officeHistory.map((entry) => ({
      ...entry,
    })),
    listeners: [],
  };
}

export function subscribeEconomy(economy, listener) {
  economy.listeners.push(listener);
}

function notifyEconomy(economy) {
  for (const listener of economy.listeners) {
    listener(economy);
  }
}

export function isGoalComplete(economy, goalId) {
  return economy.completedGoalIds.includes(goalId);
}

export function ownsUpgrade(economy, upgradeId) {
  return economy.ownedUpgradeIds.includes(upgradeId);
}

export function ownsOffice(economy, officeId) {
  return economy.ownedOfficeIds.includes(officeId);
}

export function listGoals(economy) {
  return economy.goals.map((goal) => ({
    ...goal,
    isComplete: isGoalComplete(economy, goal.id),
  }));
}

export function listUpgrades(economy) {
  return economy.upgrades.map((upgrade) => ({
    ...upgrade,
    isOwned: ownsUpgrade(economy, upgrade.id),
  }));
}

export function listOffices(economy) {
  return economy.offices.map((office) => ({
    ...office,
    isOwned: ownsOffice(economy, office.id),
    isCurrent: economy.currentOfficeId === office.id,
  }));
}

export function listOfficeHistory(economy) {
  return economy.officeHistory.map((entry) => ({ ...entry }));
}

export function completeGoal(economy, goalId) {
  const goal = economy.goalById[goalId];

  if (!goal) {
    return {
      ok: false,
      reason: "Unknown goal.",
    };
  }

  if (isGoalComplete(economy, goalId)) {
    return {
      ok: false,
      reason: "Already completed.",
    };
  }

  economy.completedGoalIds.push(goalId);
  economy.companyBucks += goal.rewardBucks;
  writeStoredEconomy(economy);
  notifyEconomy(economy);

  return {
    ok: true,
    rewardBucks: goal.rewardBucks,
    title: goal.title,
  };
}

export function purchaseUpgrade(economy, upgradeId) {
  const upgrade = economy.upgradeById[upgradeId];

  if (!upgrade) {
    return {
      ok: false,
      reason: "Unknown upgrade.",
    };
  }

  if (ownsUpgrade(economy, upgradeId)) {
    return {
      ok: false,
      reason: "Already owned.",
    };
  }

  if (economy.companyBucks < upgrade.costBucks) {
    return {
      ok: false,
      reason: "Not enough bucks.",
    };
  }

  economy.companyBucks -= upgrade.costBucks;
  economy.ownedUpgradeIds.push(upgradeId);
  writeStoredEconomy(economy);
  notifyEconomy(economy);

  return {
    ok: true,
    costBucks: upgrade.costBucks,
    title: upgrade.title,
  };
}

export function purchaseOffice(economy, officeId) {
  const office = economy.officeById[officeId];

  if (!office) {
    return {
      ok: false,
      reason: "Unknown office.",
    };
  }

  if (ownsOffice(economy, officeId)) {
    return {
      ok: false,
      reason: "Already owned.",
    };
  }

  if (economy.companyBucks < office.costBucks) {
    return {
      ok: false,
      reason: "Not enough bucks.",
    };
  }

  economy.companyBucks -= office.costBucks;
  economy.ownedOfficeIds.push(officeId);
  economy.currentOfficeId = officeId;
  economy.officeHistory.push({
    officeId,
    displayName: office.displayName,
    atMs: Date.now(),
    note: `Purchased for ${office.costBucks} bucks.`,
  });
  writeStoredEconomy(economy);
  notifyEconomy(economy);

  return {
    ok: true,
    costBucks: office.costBucks,
    title: office.displayName,
    officeId,
  };
}

export function selectOwnedOffice(economy, officeId) {
  if (!ownsOffice(economy, officeId)) {
    return {
      ok: false,
      reason: "Office not owned.",
    };
  }

  if (economy.currentOfficeId === officeId) {
    return {
      ok: false,
      reason: "Already here.",
    };
  }

  const office = economy.officeById[officeId];

  economy.currentOfficeId = officeId;
  economy.officeHistory.push({
    officeId,
    displayName: office.displayName,
    atMs: Date.now(),
    note: "Moved back in.",
  });
  writeStoredEconomy(economy);
  notifyEconomy(economy);

  return {
    ok: true,
    title: office.displayName,
    officeId,
  };
}

export function formatCompanyBucks(amount) {
  return `${amount} bucks`;
}
