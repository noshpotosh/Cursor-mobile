import {
  MessageRole,
  PLAYER_STAFF_ID,
  PresenceStatus,
} from "./constants.js";

export function presenceForPerson(person, desktop, occupancy) {
  if (person.id === PLAYER_STAFF_ID || person.isPlayer) {
    return desktop.isOpen
      ? PresenceStatus.AVAILABLE
      : PresenceStatus.AWAY;
  }

  if (occupancy && occupancy[person.id] === false) {
    return PresenceStatus.AWAY;
  }

  return PresenceStatus.AVAILABLE;
}

export function presenceClass(status) {
  if (status === PresenceStatus.AVAILABLE) {
    return "is-available";
  }

  return "is-away";
}

export function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

export function createEl(tagName, className, text) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (text != null) {
    element.textContent = text;
  }

  return element;
}

export function formatClock(date) {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatHistoryStamp(atMs) {
  try {
    return new Date(atMs).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch (error) {
    return "";
  }
}

export function bubbleClassForRole(role) {
  if (role === MessageRole.USER) {
    return "teams-bubble teams-bubble-me";
  }

  if (role === MessageRole.SYSTEM) {
    return "teams-bubble teams-bubble-system";
  }

  return "teams-bubble teams-bubble-them";
}
