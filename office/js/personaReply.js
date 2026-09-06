// Pick a persona-flavored reply from keyword packs.

function normalizeMessage(text) {
  return text.trim().toLowerCase();
}

function scoreReply(entry, message) {
  let hits = 0;

  for (const keyword of entry.match) {
    if (message.includes(keyword)) {
      hits += 1;
    }
  }

  return hits;
}

export function replyFromPersona(persona, userMessage) {
  if (!persona) {
    return "No agent persona loaded for this teammate.";
  }

  const message = normalizeMessage(userMessage);

  if (!message) {
    return persona.fallback;
  }

  let bestEntry = null;
  let bestScore = 0;

  for (const entry of persona.replies || []) {
    const score = scoreReply(entry, message);

    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  if (bestEntry) {
    return bestEntry.line;
  }

  return persona.fallback;
}

export function greetingFromPersona(persona) {
  if (!persona) {
    return "Hey.";
  }

  return persona.greeting || persona.fallback || "Hey.";
}
