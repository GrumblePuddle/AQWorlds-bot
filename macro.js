const { keyboard, Key } = require("@nut-tree-fork/nut-js");

let running = false;

let macroConfig = {
  mainSequence: [Key.Num2, Key.Num3],
  extraKey: Key.Num4,
  extraEvery: 5,
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay() {
  return 1000 + Math.random() * 500;
}

async function tapKey(key) {
  await keyboard.pressKey(key);
  await keyboard.releaseKey(key);
}

function parseKeyString(value) {
  const trimmed = value.trim();

  const keyMap = {
    1: Key.Num1,
    2: Key.Num2,
    3: Key.Num3,
    4: Key.Num4,
    5: Key.Num5,
    6: Key.Num6,
    7: Key.Num7,
    8: Key.Num8,
    9: Key.Num9,
    0: Key.Num0,
  };

  return keyMap[trimmed] || null;
}

function parseSequence(sequenceString) {
  return sequenceString
    .split(",")
    .map((part) => parseKeyString(part))
    .filter(Boolean);
}

function startMacro(config) {
  if (config) {
    const parsedMainSequence = parseSequence(config.mainSequence);
    const parsedExtraKey = parseKeyString(config.extraKey);
    const parsedExtraEvery = Number(config.extraEvery);

    if (parsedMainSequence.length === 0) {
      console.log("Invalid main sequence");
      return;
    }

    if (!parsedExtraKey) {
      console.log("Invalid extra key");
      return;
    }

    if (!parsedExtraEvery || parsedExtraEvery < 1) {
      console.log("Invalid extraEvery value");
      return;
    }

    macroConfig = {
      mainSequence: parsedMainSequence,
      extraKey: parsedExtraKey,
      extraEvery: parsedExtraEvery,
    };

    console.log("Macro config updated:", config);
  }

  running = true;
  console.log("Macro started");
}

function stopMacro() {
  running = false;
  console.log("Macro stopped");
}

async function runMacro() {
  let mainLoopCount = 0;

  while (true) {
    if (running) {
      for (const key of macroConfig.mainSequence) {
        if (!running) break;

        await tapKey(key);
        await sleep(randomDelay());
      }

      if (running) {
        mainLoopCount++;

        if (mainLoopCount >= macroConfig.extraEvery) {
          await tapKey(macroConfig.extraKey);
          await sleep(randomDelay());
          mainLoopCount = 0;
        }
      }
    }

    await sleep(50);
  }
}

runMacro().catch((error) => {
  console.error("An error occurred:", error);
});

module.exports = { startMacro, stopMacro };
