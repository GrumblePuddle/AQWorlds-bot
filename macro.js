const { keyboard, Key } = require("@nut-tree-fork/nut-js");
const { uIOhook, UiohookKey } = require("uiohook-napi");

keyboard.config.autoDelayMs = 0;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay() {
  return 1500 + Math.random() * 500;
}

const rotation = [Key.Num2, Key.Num3];

async function tapKey(key) {
  await keyboard.pressKey(key);
  await keyboard.releaseKey(key);
}

async function runMacro() {
  console.log("Starting in 5 seconds...");
  await sleep(5000);

  while (true) {
    for (let i = 0; i < 10; i++) {
      for (const key of rotation) {
        tapKey(key);
        await sleep(randomDelay());
      }
    }
    tapKey(Key.Num5);
    await sleep(randomDelay());
  }
}

runMacro().catch((error) => {
  console.error("An error occurred:", error);
});
