const { ipcRenderer } = require("electron");

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const statusBadge = document.getElementById("statusBadge");
const statusText = document.getElementById("statusText");
const stateLabel = document.getElementById("stateLabel");

function setStatus(isRunning) {
  if (isRunning) {
    statusText.textContent = "Running";
    stateLabel.textContent = "Running";
    statusBadge.classList.add("running");
  } else {
    statusText.textContent = "Stopped";
    stateLabel.textContent = "Idle";
    statusBadge.classList.remove("running");
  }
}

startBtn.addEventListener("click", () => {
  ipcRenderer.send("start-macro");
  setStatus(true);
});

stopBtn.addEventListener("click", () => {
  ipcRenderer.send("stop-macro");
  setStatus(false);
});

ipcRenderer.on("macro-status-changed", (_event, isRunning) => {
  setStatus(isRunning);
});

setStatus(false);
