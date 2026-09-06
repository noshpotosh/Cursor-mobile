import {
  AGENT_CHAT_STORAGE_KEY,
  AGENT_REPLY_DELAY_MS,
  MessageRole,
  PLAYER_STAFF_ID,
} from "./constants.js";
import {
  greetingFromPersona,
  replyFromPersona,
} from "./personaReply.js";

function emptyStore() {
  return { threads: {} };
}

function readStore() {
  try {
    const raw = window.localStorage.getItem(
      AGENT_CHAT_STORAGE_KEY
    );

    if (!raw) {
      return emptyStore();
    }

    const parsed = JSON.parse(raw);

    if (!parsed || typeof parsed.threads !== "object") {
      return emptyStore();
    }

    return { threads: parsed.threads };
  } catch (error) {
    return emptyStore();
  }
}

function writeStore(store) {
  window.localStorage.setItem(
    AGENT_CHAT_STORAGE_KEY,
    JSON.stringify({ threads: store.threads })
  );
}

function makeMessage(role, text, staffId) {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    text,
    staffId,
    atMs: Date.now(),
  };
}

function personaByStaffId(personas) {
  const byId = {};

  for (const persona of personas) {
    byId[persona.staffId] = persona;
  }

  return byId;
}

export function createAgentBus(personas) {
  return {
    personasById: personaByStaffId(personas),
    store: readStore(),
    listeners: [],
  };
}

export function subscribeAgentBus(bus, listener) {
  bus.listeners.push(listener);
}

function notifyBus(bus, event) {
  for (const listener of bus.listeners) {
    listener(event);
  }
}

export function listThread(bus, staffId) {
  const thread = bus.store.threads[staffId];

  if (!thread) {
    return [];
  }

  return thread.map((message) => ({ ...message }));
}

export function ensureThreadGreeting(bus, staffId) {
  if (bus.store.threads[staffId]?.length) {
    return listThread(bus, staffId);
  }

  const persona = bus.personasById[staffId];
  const greeting = makeMessage(
    MessageRole.AGENT,
    greetingFromPersona(persona),
    staffId
  );

  bus.store.threads[staffId] = [greeting];
  writeStore(bus.store);
  notifyBus(bus, {
    type: "thread-ready",
    staffId,
    messages: listThread(bus, staffId),
  });

  return listThread(bus, staffId);
}

export function sendAgentMessage(bus, staffId, text) {
  const trimmed = text.trim();

  if (!trimmed) {
    return {
      ok: false,
      reason: "Empty message.",
    };
  }

  ensureThreadGreeting(bus, staffId);

  const userMessage = makeMessage(
    MessageRole.USER,
    trimmed,
    staffId
  );

  bus.store.threads[staffId].push(userMessage);
  writeStore(bus.store);
  notifyBus(bus, {
    type: "message",
    staffId,
    message: userMessage,
  });

  const persona = bus.personasById[staffId];
  const replyText = replyFromPersona(persona, trimmed);
  const isSelfNote = staffId === PLAYER_STAFF_ID;

  window.setTimeout(() => {
    const agentMessage = makeMessage(
      isSelfNote ? MessageRole.SYSTEM : MessageRole.AGENT,
      replyText,
      staffId
    );

    if (!bus.store.threads[staffId]) {
      bus.store.threads[staffId] = [];
    }

    bus.store.threads[staffId].push(agentMessage);
    writeStore(bus.store);
    notifyBus(bus, {
      type: "message",
      staffId,
      message: agentMessage,
    });
  }, AGENT_REPLY_DELAY_MS);

  return {
    ok: true,
    staffId,
  };
}

// Seam for a future remote Cursor agent provider.
export function describeAgentProvider(bus, staffId) {
  const persona = bus.personasById[staffId];

  return {
    kind: "local-persona",
    staffId,
    agentFile: persona?.agentFile || null,
    note:
      "Local persona pack. Swap this provider for live "
      + "Cursor agent delivery when a backend exists.",
  };
}
