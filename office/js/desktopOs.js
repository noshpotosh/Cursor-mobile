import {
  DesktopAppId,
  DESKTOP_CLOCK_INTERVAL_MS,
  MessageRole,
} from "./constants.js";
import {
  ensureThreadGreeting,
  listThread,
  sendAgentMessage,
  subscribeAgentBus,
} from "./agentBus.js";
import {
  clearElement,
  createEl,
  formatClock,
  bubbleClassForRole,
  presenceClass,
  presenceForPerson,
} from "./desktopDom.js";
import { renderLoftApp } from "./desktopLoftApp.js";
import {
  completeGoal,
  formatCompanyBucks,
  listGoals,
} from "./economy.js";

function paintTeamsThread(log, agentBus, staffId) {
  clearElement(log);
  const messages = listThread(agentBus, staffId);

  if (!messages.length) {
    log.appendChild(
      createEl("p", "teams-placeholder", "No messages yet.")
    );
    return;
  }

  for (const message of messages) {
    log.appendChild(
      createEl(
        "p",
        bubbleClassForRole(message.role),
        message.text
      )
    );
  }

  log.scrollTop = log.scrollHeight;
}

function buildTeamsRosterRow(person, status, onSelect) {
  const row = createEl("button", "teams-roster-row");
  row.type = "button";

  row.appendChild(
    createEl("span", `presence-dot ${presenceClass(status)}`)
  );
  row.appendChild(
    createEl("span", "teams-roster-name", person.displayName)
  );
  row.appendChild(
    createEl("span", "teams-roster-status", status)
  );
  row.addEventListener("click", () => {
    onSelect(person);
  });
  return row;
}

function renderTeamsApp(body, desktop) {
  clearElement(body);

  const staffList = desktop.staffList;
  const agentBus = desktop.agentBus;
  const occupancy = desktop.getOccupancy
    ? desktop.getOccupancy()
    : {};

  const layout = createEl("div", "teams-layout");
  const roster = createEl("aside", "teams-roster");
  const thread = createEl("section", "teams-thread");
  const title = createEl("h2", "teams-thread-title");
  const log = createEl("div", "teams-thread-log");
  const typing = createEl("p", "teams-typing");
  const compose = createEl("form", "teams-compose");
  const input = createEl("input", "teams-compose-input");
  const sendButton = createEl(
    "button",
    "teams-compose-send",
    "Send"
  );

  let activeStaffId = null;

  title.textContent = "Select a teammate";
  typing.hidden = true;
  typing.textContent = "Typing…";
  log.appendChild(
    createEl(
      "p",
      "teams-placeholder",
      "Pick a teammate to open their agent thread."
    )
  );

  input.type = "text";
  input.placeholder = "Message your teammate…";
  input.setAttribute("aria-label", "Teams message");
  sendButton.type = "submit";

  function showThread(person) {
    activeStaffId = person.id;
    title.textContent = person.displayName;
    typing.hidden = true;
    ensureThreadGreeting(agentBus, person.id);
    paintTeamsThread(log, agentBus, person.id);
  }

  subscribeAgentBus(agentBus, (event) => {
    if (!activeStaffId || event.staffId !== activeStaffId) {
      return;
    }

    if (event.type === "message") {
      if (event.message.role === MessageRole.USER) {
        typing.hidden = false;
      } else {
        typing.hidden = true;
      }

      paintTeamsThread(log, agentBus, activeStaffId);
    }

    if (event.type === "thread-ready") {
      paintTeamsThread(log, agentBus, activeStaffId);
    }
  });

  for (const person of staffList) {
    const status = presenceForPerson(
      person,
      desktop,
      occupancy
    );
    roster.appendChild(
      buildTeamsRosterRow(person, status, showThread)
    );
  }

  compose.addEventListener("submit", (event) => {
    event.preventDefault();

    const message = input.value.trim();

    if (!message || !activeStaffId) {
      return;
    }

    const result = sendAgentMessage(
      agentBus,
      activeStaffId,
      message
    );

    if (!result.ok) {
      return;
    }

    input.value = "";

    if (desktop.onMessageSent) {
      desktop.onMessageSent();
    }
  });

  compose.appendChild(input);
  compose.appendChild(sendButton);
  thread.appendChild(title);
  thread.appendChild(log);
  thread.appendChild(typing);
  thread.appendChild(compose);
  layout.appendChild(roster);
  layout.appendChild(thread);
  body.appendChild(layout);
}

function renderDirectoryApp(body, desktop) {
  clearElement(body);

  const staffList = desktop.staffList;
  const occupancy = desktop.getOccupancy
    ? desktop.getOccupancy()
    : {};

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
    const status = presenceForPerson(
      person,
      desktop,
      occupancy
    );

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
    const status = presenceForPerson(
      person,
      desktop,
      occupancy
    );
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

export function createDesktopOs(options) {
  const root = options.root;
  const staffList = options.staffList;
  const economy = options.economy;
  const agentBus = options.agentBus;
  const onClose = options.onClose;
  const onGoalComplete = options.onGoalComplete;
  const onUpgradePurchase = options.onUpgradePurchase;
  const onOfficeChange = options.onOfficeChange;
  const onMessageSent = options.onMessageSent;
  const getOccupancy = options.getOccupancy;

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
    agentBus,
    onClose,
    onGoalComplete,
    onUpgradePurchase,
    onOfficeChange,
    onMessageSent,
    getOccupancy,
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
      renderTeamsApp(bodyEl, state);
      return;
    }

    if (appId === DesktopAppId.DIRECTORY) {
      titleEl.textContent = "Employee Directory";
      renderDirectoryApp(bodyEl, state);
      return;
    }

    if (appId === DesktopAppId.GOALS) {
      titleEl.textContent = "Team Goals";
      renderGoalsApp(
        bodyEl,
        economy,
        onGoalComplete
      );
      return;
    }

    if (appId === DesktopAppId.LOFT) {
      titleEl.textContent = "Loft Shop";
      renderLoftApp(bodyEl, state);
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
  }, DESKTOP_CLOCK_INTERVAL_MS);

  const firstIcon = desktop.root.querySelector("[data-app]");

  if (firstIcon) {
    firstIcon.focus();
  }
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
