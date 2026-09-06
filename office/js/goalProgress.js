import {
  AGENT_REPLY_GOAL_TARGET_COUNT,
  GoalEventKind,
  GoalId,
  TALK_GOAL_TARGET_COUNT,
} from "./constants.js";

export const TRACKED_GOAL_IDS = [
  GoalId.SHIP_PHASE4_DESKTOP,
  GoalId.TALK_TO_THREE_TEAMMATES,
  GoalId.HYDRATE_ONCE,
  GoalId.OPEN_DIRECTORY_PROFILE,
  GoalId.MESSAGE_TWO_AGENTS,
  GoalId.SIP_OFFICE_COFFEE,
  GoalId.READ_WHITEBOARD_NOTE,
];

function emptyGoalProgress() {
  return {
    openedDesktop: false,
    openedTeams: false,
    openedDirectory: false,
    hydrated: false,
    sippedCoffee: false,
    readBoard: false,
    viewedDirectoryStaffIds: [],
    talkedStaffIds: [],
    agentReplyStaffIds: [],
  };
}

export function createGoalProgress(stored) {
  const blank = emptyGoalProgress();

  if (!stored || typeof stored !== "object") {
    return blank;
  }

  return {
    openedDesktop: Boolean(stored.openedDesktop),
    openedTeams: Boolean(stored.openedTeams),
    openedDirectory: Boolean(stored.openedDirectory),
    hydrated: Boolean(stored.hydrated),
    sippedCoffee: Boolean(stored.sippedCoffee),
    readBoard: Boolean(stored.readBoard),
    viewedDirectoryStaffIds: Array.isArray(
      stored.viewedDirectoryStaffIds
    )
      ? stored.viewedDirectoryStaffIds.filter(
          (id) => typeof id === "string"
        )
      : [],
    talkedStaffIds: Array.isArray(stored.talkedStaffIds)
      ? stored.talkedStaffIds.filter(
          (id) => typeof id === "string"
        )
      : [],
    agentReplyStaffIds: Array.isArray(
      stored.agentReplyStaffIds
    )
      ? stored.agentReplyStaffIds.filter(
          (id) => typeof id === "string"
        )
      : [],
  };
}

function pushUnique(list, value) {
  if (!value || list.includes(value)) {
    return list;
  }

  return [...list, value];
}

export function goalIsReady(goalId, progress) {
  if (goalId === GoalId.HYDRATE_ONCE) {
    return progress.hydrated;
  }

  if (goalId === GoalId.SIP_OFFICE_COFFEE) {
    return progress.sippedCoffee;
  }

  if (goalId === GoalId.READ_WHITEBOARD_NOTE) {
    return progress.readBoard;
  }

  if (goalId === GoalId.OPEN_DIRECTORY_PROFILE) {
    return progress.viewedDirectoryStaffIds.length >= 1;
  }

  if (goalId === GoalId.TALK_TO_THREE_TEAMMATES) {
    return (
      progress.talkedStaffIds.length
      >= TALK_GOAL_TARGET_COUNT
    );
  }

  if (goalId === GoalId.MESSAGE_TWO_AGENTS) {
    return (
      progress.agentReplyStaffIds.length
      >= AGENT_REPLY_GOAL_TARGET_COUNT
    );
  }

  if (goalId === GoalId.SHIP_PHASE4_DESKTOP) {
    return (
      progress.openedDesktop
      && progress.openedTeams
      && progress.openedDirectory
    );
  }

  return false;
}

export function describeGoalProgress(goalId, progress) {
  if (goalId === GoalId.HYDRATE_ONCE) {
    return progress.hydrated
      ? "Bubbler drunk"
      : "Drink from the bubbler";
  }

  if (goalId === GoalId.SIP_OFFICE_COFFEE) {
    return progress.sippedCoffee
      ? "Coffee poured"
      : "Pour loft coffee";
  }

  if (goalId === GoalId.READ_WHITEBOARD_NOTE) {
    return progress.readBoard
      ? "Board read"
      : "Read the whiteboard";
  }

  if (goalId === GoalId.OPEN_DIRECTORY_PROFILE) {
    return progress.viewedDirectoryStaffIds.length >= 1
      ? "Profile opened"
      : "Open a Directory profile";
  }

  if (goalId === GoalId.TALK_TO_THREE_TEAMMATES) {
    return (
      `${progress.talkedStaffIds.length}`
      + ` / ${TALK_GOAL_TARGET_COUNT} teammates talked`
    );
  }

  if (goalId === GoalId.MESSAGE_TWO_AGENTS) {
    return (
      `${progress.agentReplyStaffIds.length}`
      + ` / ${AGENT_REPLY_GOAL_TARGET_COUNT} agent replies`
    );
  }

  if (goalId === GoalId.SHIP_PHASE4_DESKTOP) {
    const parts = [];

    if (progress.openedDesktop) {
      parts.push("desk PC");
    }

    if (progress.openedTeams) {
      parts.push("Teams");
    }

    if (progress.openedDirectory) {
      parts.push("Directory");
    }

    if (parts.length === 3) {
      return "Desktop path proven";
    }

    if (parts.length === 0) {
      return "Open desk PC, Teams, and Directory";
    }

    return `Opened: ${parts.join(", ")}`;
  }

  return "In progress";
}

export function applyGoalEvent(progress, kind, detail) {
  const next = {
    ...progress,
    viewedDirectoryStaffIds: [
      ...progress.viewedDirectoryStaffIds,
    ],
    talkedStaffIds: [...progress.talkedStaffIds],
    agentReplyStaffIds: [...progress.agentReplyStaffIds],
  };

  if (kind === GoalEventKind.OPEN_DESKTOP) {
    next.openedDesktop = true;
  }

  if (kind === GoalEventKind.OPEN_TEAMS) {
    next.openedTeams = true;
  }

  if (kind === GoalEventKind.OPEN_DIRECTORY) {
    next.openedDirectory = true;
  }

  if (kind === GoalEventKind.DIRECTORY_PROFILE) {
    next.viewedDirectoryStaffIds = pushUnique(
      next.viewedDirectoryStaffIds,
      detail && detail.staffId
    );
  }

  if (kind === GoalEventKind.TALK) {
    next.talkedStaffIds = pushUnique(
      next.talkedStaffIds,
      detail && detail.staffId
    );
  }

  if (kind === GoalEventKind.DRINK) {
    next.hydrated = true;
  }

  if (kind === GoalEventKind.SIP_COFFEE) {
    next.sippedCoffee = true;
  }

  if (kind === GoalEventKind.READ_BOARD) {
    next.readBoard = true;
  }

  if (kind === GoalEventKind.AGENT_REPLY) {
    next.agentReplyStaffIds = pushUnique(
      next.agentReplyStaffIds,
      detail && detail.staffId
    );
  }

  return next;
}
