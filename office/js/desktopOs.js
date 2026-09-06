import {
  DesktopAppId,
  PresenceStatus,
  StaffTeamsStubLine,
} from "./constants.js";
import {
  completeGoal,
  formatCompanyBucks,
  listGoals,
  listUpgrades,
  purchaseUpgrade,
} from "./economy.js";

function presenceForPerson(person, desktopOpen) {
  if (person.isPlayer) {
    return desktopOpen
      ? PresenceStatus.AVAILABLE
      : PresenceStatus.AWAY;
  }

  // Phase 3 seats NPCs at desks; treat them as available.
  return PresenceStatus.AVAILABLE;
}

function presenceClass(status) {
  if (status === PresenceStatus.AVAILABLE) {
    return "is-available";
  }

  return "is-away";
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function createEl(tagName, className, text) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (text != null) {
    element.textContent = text;
  }

  return element;
}

function formatClock(date) {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function renderTeamsApp(body, staffList, desktopOpen) {
  clearElement(body);

  const layout = createEl("div", "teams-layout");
  const roster = createEl("aside", "teams-roster");
  const thread = createEl("section", "teams-thread");
  const title = createEl("h2", "teams-thread-title");
  const log = createEl("div", "teams-thread-log");
  const compose = createEl("form", "teams-compose");
  const input = createEl("input", "teams-compose-input");
  const sendButton = createEl(
    "button",
    "teams-compose-send",
    "Send"
  );

  let activeStaffId = null;

  title.textContent = "Select a teammate";
  log.appendChild(
    createEl(
      "p",
      "teams-placeholder",
      "Pick someone from the roster to open a stub chat."
    )
  );

  input.type = "text";
  input.placeholder = "Message (stub — agents later)";
  input.setAttribute("aria-label", "Teams message");
  sendButton.type = "submit";

  function showThread(person) {
    activeStaffId = person.id;
    clearElement(log);
    title.textContent = person.displayName;

    const stub =
      StaffTeamsStubLine[person.id]
      || "No stub line yet.";

    log.appendChild(
      createEl(
        "p",
        "teams-bubble teams-bubble-them",
        stub
      )
    );
  }

  for (const person of staffList) {
    const status = presenceForPerson(person, desktopOpen);
    const row = createEl("button", "teams-roster-row");
    row.type = "button";

    row.appendChild(
      createEl(
        "span",
        `presence-dot ${presenceClass(status)}`
      )
    );
    row.appendChild(
      createEl(
        "span",
        "teams-roster-name",
        person.displayName
      )
    );
    row.appendChild(
      createEl("span", "teams-roster-status", status)
    );
    row.addEventListener("click", () => {
      showThread(person);
    });
    roster.appendChild(row);
  }

  compose.addEventListener("submit", (event) => {
    event.preventDefault();

    const message = input.value.trim();

    if (!message || !activeStaffId) {
      return;
    }

    log.appendChild(
      createEl("p", "teams-bubble teams-bubble-me", message)
    );
    log.appendChild(
      createEl(
        "p",
        "teams-bubble teams-bubble-system",
        "Queued. Real agent delivery comes later."
      )
    );
    input.value = "";
    log.scrollTop = log.scrollHeight;
  });

  compose.appendChild(input);
  compose.appendChild(sendButton);
  thread.appendChild(title);
  thread.appendChild(log);
  thread.appendChild(compose);
  layout.appendChild(roster);
  layout.appendChild(thread);
  body.appendChild(layout);
}

function renderDirectoryApp(body, staffList, desktopOpen) {
  clearElement(body);

  const layout = createEl("div", "directory-layout");
  const list = createEl("aside", "directory-list");
  const detail = createEl("section", "directory-detail");

  detail.appendChild(
    createEl(
      "p",
      "directory-placeholder",
      "Select a teammate to view their profile."
    )
  );

  function showProfile(person) {
    clearElement(detail);
    const status = presenceForPerson(person, desktopOpen);

    detail.appendChild(
      createEl("h2", "directory-name", person.displayName)
    );
    detail.appendChild(
      createEl("p", "directory-role", person.role)
    );
    detail.appendChild(
      createEl(
        "p",
        `directory-presence ${presenceClass(status)}`,
        status
      )
    );
    detail.appendChild(
      createEl("p", "directory-about", person.about)
    );
  }

  for (const person of staffList) {
    const status = presenceForPerson(person, desktopOpen);
    const row = createEl("button", "directory-row");
    row.type = "button";

    row.appendChild(
      createEl(
        "span",
        `presence-dot ${presenceClass(status)}`
      )
    );
    row.appendChild(
      createEl(
        "span",
        "directory-row-name",
        person.displayName
      )
    );
    row.addEventListener("click", () => {
      showProfile(person);
    });
    list.appendChild(row);
  }

  layout.appendChild(list);
  layout.appendChild(detail);
  body.appendChild(layout);
}

function renderGoalsApp(body, economy, onGoalComplete) {
  clearElement(body);

  const layout = createEl("div", "goals-layout");
  const summary = createEl("p", "goals-summary");
  const list = createEl("div", "goals-list");

  function refresh() {
    clearElement(list);
    summary.textContent =
      `Company balance: ${formatCompanyBucks(economy.companyBucks)}`;

    for (const goal of listGoals(economy)) {
      const card = createEl("article", "goal-card");

      if (goal.isComplete) {
        card.classList.add("is-complete");
      }

      card.appendChild(
        createEl("h3", "goal-title", goal.title)
      );
      card.appendChild(
        createEl(
          "p",
          "goal-description",
          goal.description
        )
      );

      const meta = createEl("p", "goal-meta");
      meta.textContent =
        `${goal.rewardBucks} bucks · ${goal.deadlineLabel}`;
      card.appendChild(meta);

      if (goal.isComplete) {
        card.appendChild(
          createEl("p", "goal-status", "Completed")
        );
      } else {
        const button = createEl(
          "button",
          "goal-complete-button",
          "Mark done"
        );
        button.type = "button";
        button.addEventListener("click", () => {
          const result = completeGoal(economy, goal.id);

          if (!result.ok) {
            return;
          }

          refresh();

          if (onGoalComplete) {
            onGoalComplete(result);
          }
        });
        card.appendChild(button);
      }

      list.appendChild(card);
    }
  }

  refresh();
  layout.appendChild(summary);
  layout.appendChild(list);
  body.appendChild(layout);
}

function renderLoftApp(body, economy, onUpgradePurchase) {
  clearElement(body);

  const layout = createEl("div", "loft-layout");
  const summary = createEl("p", "loft-summary");
  const list = createEl("div", "loft-list");

  function refresh() {
    clearElement(list);
    summary.textContent =
      `Company balance: ${formatCompanyBucks(economy.companyBucks)}`;

    for (const upgrade of listUpgrades(economy)) {
      const card = createEl("article", "loft-card");

      if (upgrade.isOwned) {
        card.classList.add("is-owned");
      }

      card.appendChild(
        createEl("h3", "loft-title", upgrade.title)
      );
      card.appendChild(
        createEl(
          "p",
          "loft-description",
          upgrade.description
        )
      );

      const meta = createEl("p", "loft-meta");
      meta.textContent = `${upgrade.costBucks} bucks`;
      card.appendChild(meta);

      if (upgrade.isOwned) {
        card.appendChild(
          createEl("p", "loft-status", "Installed")
        );
      } else {
        const canAfford =
          economy.companyBucks >= upgrade.costBucks;
        const button = createEl(
          "button",
          "loft-buy-button",
          canAfford ? "Buy" : "Need more bucks"
        );
        button.type = "button";
        button.disabled = !canAfford;
        button.addEventListener("click", () => {
          const result = purchaseUpgrade(
            economy,
            upgrade.id
          );

          if (!result.ok) {
            return;
          }

          refresh();

          if (onUpgradePurchase) {
            onUpgradePurchase(result);
          }
        });
        card.appendChild(button);
      }

      list.appendChild(card);
    }
  }

  refresh();
  layout.appendChild(summary);
  layout.appendChild(list);
  body.appendChild(layout);
}

export function createDesktopOs(options) {
  const root = options.root;
  const staffList = options.staffList;
  const economy = options.economy;
  const onClose = options.onClose;
  const onGoalComplete = options.onGoalComplete;
  const onUpgradePurchase = options.onUpgradePurchase;

  const windowEl = root.querySelector(".desktop-window");
  const titleEl = root.querySelector(".window-title");
  const bodyEl = root.querySelector(".window-body");
  const closeButton = root.querySelector(".window-close");
  const exitButton = root.querySelector("#desktop-exit");
  const clockEl = root.querySelector(".taskbar-clock");
  const iconButtons = root.querySelectorAll("[data-app]");

  const state = {
    root,
    staffList,
    economy,
    onClose,
    onGoalComplete,
    onUpgradePurchase,
    windowEl,
    titleEl,
    bodyEl,
    clockEl,
    isOpen: false,
    activeAppId: null,
    clockTimerId: null,
  };

  function refreshClock() {
    if (!clockEl) {
      return;
    }

    clockEl.textContent = formatClock(new Date());
  }

  function closeWindow() {
    state.activeAppId = null;

    if (windowEl) {
      windowEl.hidden = true;
    }

    if (titleEl) {
      titleEl.textContent = "";
    }

    if (bodyEl) {
      clearElement(bodyEl);
    }
  }

  function openApp(appId) {
    if (!windowEl || !bodyEl || !titleEl) {
      return;
    }

    state.activeAppId = appId;
    windowEl.hidden = false;

    if (appId === DesktopAppId.TEAMS) {
      titleEl.textContent = "Teams";
      renderTeamsApp(bodyEl, staffList, true);
      return;
    }

    if (appId === DesktopAppId.DIRECTORY) {
      titleEl.textContent = "Employee Directory";
      renderDirectoryApp(bodyEl, staffList, true);
      return;
    }

    if (appId === DesktopAppId.GOALS) {
      titleEl.textContent = "Team Goals";
      renderGoalsApp(bodyEl, economy, onGoalComplete);
      return;
    }

    if (appId === DesktopAppId.LOFT) {
      titleEl.textContent = "Loft Shop";
      renderLoftApp(bodyEl, economy, onUpgradePurchase);
    }
  }

  for (const button of iconButtons) {
    button.addEventListener("click", () => {
      openApp(button.dataset.app);
    });
  }

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      closeWindow();
    });
  }

  if (exitButton) {
    exitButton.addEventListener("click", () => {
      closeDesktopOs(state);
    });
  }

  state.closeWindow = closeWindow;
  state.openApp = openApp;
  state.refreshClock = refreshClock;

  return state;
}

export function isDesktopOsOpen(desktop) {
  return Boolean(desktop && desktop.isOpen);
}

export function openDesktopOs(desktop) {
  if (!desktop || desktop.isOpen) {
    return;
  }

  desktop.isOpen = true;
  desktop.root.hidden = false;
  desktop.closeWindow();
  desktop.refreshClock();
  desktop.clockTimerId = window.setInterval(() => {
    desktop.refreshClock();
  }, 30000);
}

export function closeDesktopOs(desktop) {
  if (!desktop || !desktop.isOpen) {
    return;
  }

  desktop.isOpen = false;
  desktop.closeWindow();
  desktop.root.hidden = true;

  if (desktop.clockTimerId !== null) {
    window.clearInterval(desktop.clockTimerId);
    desktop.clockTimerId = null;
  }

  if (desktop.onClose) {
    desktop.onClose();
  }
}

export function handleDesktopOsKeydown(desktop, event) {
  if (!isDesktopOsOpen(desktop)) {
    return false;
  }

  if (event.key !== "Escape") {
    return true;
  }

  if (desktop.activeAppId) {
    desktop.closeWindow();
    return true;
  }

  closeDesktopOs(desktop);
  return true;
}
