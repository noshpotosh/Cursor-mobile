import {
  AUDIO_MUTE_STORAGE_KEY,
  UI_BLIP_CLOSE_DELAY_MS,
  UI_BLIP_DURATION_SEC,
  UI_BLIP_GAIN,
  UiBlipHz,
} from "./constants.js";

function readMuteFlag() {
  try {
    return (
      window.localStorage.getItem(AUDIO_MUTE_STORAGE_KEY) === "1"
    );
  } catch (error) {
    return false;
  }
}

function writeMuteFlag(isMuted) {
  window.localStorage.setItem(
    AUDIO_MUTE_STORAGE_KEY,
    isMuted ? "1" : "0"
  );
}

export function createAudioBus() {
  return {
    isMuted: readMuteFlag(),
  };
}

export function isAudioMuted(audio) {
  return Boolean(audio && audio.isMuted);
}

export function setAudioMuted(audio, isMuted) {
  audio.isMuted = Boolean(isMuted);
  writeMuteFlag(audio.isMuted);
  return audio.isMuted;
}

export function toggleAudioMuted(audio) {
  return setAudioMuted(audio, !audio.isMuted);
}

function blipHzForKind(kind) {
  if (kind === "message") {
    return UiBlipHz.MESSAGE;
  }

  if (kind === "drink") {
    return UiBlipHz.DRINK;
  }

  return UiBlipHz.CLICK;
}

// Soft Web Audio blips — silent when muted or AudioContext blocked.
export function playUiBlip(audio, kind) {
  if (!audio || audio.isMuted) {
    return;
  }

  const AudioContextClass =
    window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  try {
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;
    const frequency = blipHzForKind(kind);

    oscillator.type = "triangle";
    oscillator.frequency.value = frequency;
    gain.gain.value = UI_BLIP_GAIN;
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + UI_BLIP_DURATION_SEC
    );
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + UI_BLIP_DURATION_SEC);
    window.setTimeout(() => {
      context.close();
    }, UI_BLIP_CLOSE_DELAY_MS);
  } catch (error) {
    // Autoplay / AudioContext restrictions — ignore.
  }
}
