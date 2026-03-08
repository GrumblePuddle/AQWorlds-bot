const { ipcRenderer } = require("electron");

const mainSequenceInput = document.getElementById("mainSequence");
const extraKeyInput = document.getElementById("extraKey");
const extraEveryInput = document.getElementById("extraEvery");

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

const status = document.getElementById("status");
const statusBadge = document.getElementById("statusBadge");
const sequencePreview = document.getElementById("sequencePreview");

function updatePreview() {
  const mainSequence = mainSequenceInput.value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const extraKey = extraKeyInput.value.trim() || "?";
  const extraEvery = extraEveryInput.value.trim() || "?";

  sequencePreview.innerHTML = "";

  if (mainSequence.length === 0) {
    const emptyChip = document.createElement("div");
    emptyChip.className = "chip";
    emptyChip.textContent = "No main sequence";
    sequencePreview.appendChild(emptyChip);
  } else {
    mainSequence.forEach((key) => {
      const chip = document.createElement("div");
      chip.className = "chip";
      chip.textContent = key;
      sequencePreview.appendChild(chip);
    });
  }

  const extraChip = document.createElement("div");
  extraChip.className = "chip";
  extraChip.textContent = `Extra: ${extraKey}`;
  sequencePreview.appendChild(extraChip);

  const everyChip = document.createElement("div");
  everyChip.className = "chip";
  everyChip.textContent = `Every: ${extraEvery}`;
  sequencePreview.appendChild(everyChip);
}

function setStatus(isRunning) {
  if (isRunning) {
    status.textContent = "Running";
    statusBadge.classList.add("running");
  } else {
    status.textContent = "Stopped";
    statusBadge.classList.remove("running");
  }
}

startBtn.addEventListener("click", () => {
  const config = {
    mainSequence: mainSequenceInput.value,
    extraKey: extraKeyInput.value,
    extraEvery: extraEveryInput.value,
  };

  ipcRenderer.send("start-macro", config);
  setStatus(true);
});

stopBtn.addEventListener("click", () => {
  ipcRenderer.send("stop-macro");
  setStatus(false);
});

ipcRenderer.on("macro-status-changed", (_event, isRunning) => {
  setStatus(isRunning);
});

mainSequenceInput.addEventListener("input", updatePreview);
extraKeyInput.addEventListener("input", updatePreview);
extraEveryInput.addEventListener("input", updatePreview);

updatePreview();
setStatus(false);
