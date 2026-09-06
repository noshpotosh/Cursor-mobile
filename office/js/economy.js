import {
  ECONOMY_STORAGE_KEY,
  STARTING_COMPANY_BUCKS,
} from "./constants.js";

function emptyEconomyState() {
  return {
    companyBucks: STARTING_COMPANY_BUCKS,
    completedGoalIds: [],
    ownedUpgradeIds: [],
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

    return {
      companyBucks: Number.isFinite(companyBucks)
        ? companyBucks
        : STARTING_COMPANY_BUCKS,
      completedGoalIds,
      ownedUpgradeIds,
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
    })
  );
}

export function createEconomy(goals, upgrades) {
  const stored = readStoredEconomy();
  const goalById = {};
  const upgradeById = {};

  for (const goal of goals) {
    goalById[goal.id] = goal;
  }

  for (const upgrade of upgrades) {
    upgradeById[upgrade.id] = upgrade;
  }

  const state = {
    goals,
    upgrades,
    goalById,
    upgradeById,
    companyBucks: stored.companyBucks,
    completedGoalIds: [...stored.completedGoalIds],
    ownedUpgradeIds: [...stored.ownedUpgradeIds],
    listeners: [],
  };

  return state;
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

export function formatCompanyBucks(amount) {
  return `${amount} bucks`;
}
