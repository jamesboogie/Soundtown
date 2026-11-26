const cues = {
  "coin-drop": {
    name: "Coin Drop",
    hotkey: "1",
    file: "audio/coin-drop.wav",
  },
  "coin-burst": {
    name: "Coin Burst",
    hotkey: "2",
    file: "audio/coin-burst.wav",
  },
  cursor: {
    name: "Cursor Zip",
    hotkey: "3",
    file: "audio/cursor-zip.wav",
  },
  confirm: {
    name: "Level Clear",
    hotkey: "4",
    file: "audio/level-clear.wav",
  },
  blast: {
    name: "Arcade Blast",
    hotkey: "5",
    file: "audio/arcade-blast.wav",
  },
  alert: {
    name: "Alert Loop",
    hotkey: "6",
    file: "audio/alert-loop.wav",
    loop: true,
  },
};

const tileButtons = [...document.querySelectorAll(".cue-tile")];
const nowPlaying = document.querySelector("#now-playing");
const stopButton = document.querySelector("#stop-button");
const muteButton = document.querySelector("#mute-button");
const muteLabel = document.querySelector(".mute-label");
const muteIcon = document.querySelector(".mute-icon");
const volumeSlider = document.querySelector("#volume-slider");
const volumeValue = document.querySelector("#volume-value");

let activeCueId = null;
let volume = Number(volumeSlider.value) / 100;
let isMuted = false;

const players = Object.fromEntries(
  Object.entries(cues).map(([cueId, cue]) => {
    const audio = new Audio(cue.file);
    audio.preload = "auto";
    audio.loop = Boolean(cue.loop);
    audio.volume = volume;

    audio.addEventListener("ended", () => {
      if (activeCueId === cueId) {
        resetActiveCue();
        announce(`${cue.name} finished`);
      }
    });

    audio.addEventListener("error", () => {
      if (activeCueId === cueId) {
        resetActiveCue();
      }
      announce(`Unable to load ${cue.name}. Please try another sound.`);
    });

    return [cueId, audio];
  }),
);

function announce(message) {
  nowPlaying.textContent = message;
}

function setTileState(cueId, isActive) {
  const tile = document.querySelector(`[data-cue="${cueId}"]`);
  if (!tile) return;

  tile.classList.toggle("is-playing", isActive);
}

function resetActiveCue() {
  if (activeCueId) {
    setTileState(activeCueId, false);
  }
  activeCueId = null;
  stopButton.disabled = true;
  stopButton.setAttribute("aria-disabled", "true");
}

function stopAll({ announceStatus = true } = {}) {
  Object.values(players).forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });

  const stoppedCue = activeCueId ? cues[activeCueId].name : null;
  resetActiveCue();

  if (announceStatus && stoppedCue) {
    announce(`${stoppedCue} stopped`);
  }
}

async function playCue(cueId) {
  const cue = cues[cueId];
  const audio = players[cueId];
  if (!cue || !audio) return;

  stopAll({ announceStatus: false });
  audio.volume = isMuted ? 0 : volume;
  activeCueId = cueId;
  setTileState(cueId, true);
  stopButton.disabled = false;
  stopButton.setAttribute("aria-disabled", "false");
  announce(`${cue.name} playing · key ${cue.hotkey}`);

  try {
    await audio.play();
  } catch (error) {
    resetActiveCue();
    announce(`Playback needs a click or tap first. Try ${cue.name} again.`);
  }
}

function updateVolume() {
  volume = Number(volumeSlider.value) / 100;
  const percentage = Math.round(volume * 100);
  volumeValue.textContent = `${percentage}%`;
  Object.values(players).forEach((audio) => {
    audio.volume = isMuted ? 0 : volume;
  });
}

function updateMuteState() {
  isMuted = !isMuted;
  Object.values(players).forEach((audio) => {
    audio.volume = isMuted ? 0 : volume;
  });

  muteButton.setAttribute("aria-pressed", String(isMuted));
  muteLabel.textContent = isMuted ? "Unmute" : "Mute";
  muteIcon.textContent = isMuted ? "×" : "◖";
  announce(isMuted ? "Soundboard muted" : `Soundboard unmuted at ${Math.round(volume * 100)}%`);
}

function isTypingTarget(target) {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target?.isContentEditable
  );
}

tileButtons.forEach((button) => {
  button.addEventListener("click", () => playCue(button.dataset.cue));
});

stopButton.addEventListener("click", () => stopAll());
muteButton.addEventListener("click", updateMuteState);
volumeSlider.addEventListener("input", updateVolume);

document.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || isTypingTarget(event.target)) {
    return;
  }

  const cueId = Object.keys(cues).find((id) => cues[id].hotkey === event.key);
  if (!cueId) return;

  event.preventDefault();
  playCue(cueId);
});
