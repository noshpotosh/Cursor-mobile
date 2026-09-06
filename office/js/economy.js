import {
  ECONOMY_STORAGE_KEY,
  STARTING_COMPANY_BUCKS,
} from "./constants.js";

function emptyEconomyState() {
  return {
    companyBucks: STARTING_COMPANY_BUCKS,
    completedGoalIds: [],
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

    return {
      companyBucks: Number.isFinite(companyBucks)
        ? companyBucks
        : STARTING_COMPANY_BUCKS,
      completedGoalIds,
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
    })
  );
}

export function createEconomy(goals) {
  const stored = readStoredEconomy();
  const goalById = {};

  for (const goal of goals) {
    goalById[goal.id] = goal;
  }

  const state = {
    goals,
    goalById,
    companyBucks: stored.companyBucks,
    completedGoalIds: [...stored.completedGoalIds],
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

export function listGoals(economy) {
  return economy.goals.map((goal) => ({
    ...goal,
    isComplete: isGoalComplete(economy, goal.id),
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

export function formatCompanyBucks(amount) {
  return `${amount} bucks`;
}
