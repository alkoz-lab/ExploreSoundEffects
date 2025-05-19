let soundExpressions: SoundExpression[] = [];
let soundExpressionsNames: string[] = [];
let soundExpressionIndex = 0;
let volume = 128;
let ackBuf = pins.createBuffer(2);
let isDisplayConnected = false;
let time = 0;
let lastTime = 0;
let welcomeMessageShown = false;
soundExpressions = [
  soundExpression.giggle,
  soundExpression.happy,
  soundExpression.hello,
  soundExpression.mysterious,
  soundExpression.sad,
  soundExpression.slide,
  soundExpression.soaring,
  soundExpression.spring,
  soundExpression.twinkle,
  soundExpression.yawn,
];
soundExpressionsNames = [
  "GIGGLE",
  "HAPPY",
  "HELLO",
  "MYSTERIOUS",
  "SAD",
  "SLIDE",
  "SOARING",
  "SPTING",
  "TWINKLE",
  "YAWN",
];
music.setVolume(volume);
led.setBrightness(64);

const I2C_ADDR = 0x3c; // Default I2C address of the SSD1306 display

function _isDisplayConnected(): boolean {
  // Load the ackBuffer to check if there is a display
  ackBuf[0] = 0;
  ackBuf[1] = 0xaf;
  // If returned value back is -1010, there is no display
  return pins.i2cWriteBuffer(I2C_ADDR, ackBuf) != -1010;
}

function connectDisplay() {
  kitronik_VIEW128x64.initDisplay();
  kitronik_VIEW128x64.controlDisplayOnOff(kitronik_VIEW128x64.onOff(true));
  if (welcomeMessageShown) showSoundExpression();
  else welcome();
}

function welcome() {
  if (welcomeMessageShown) return;
  if (!isDisplayConnected) {
    music.startMelody(
      music.builtInMelody(Melodies.BaDing),
      MelodyOptions.OnceInBackground
    );
    basic.showString("A:+1 B:play LOGO:?");
  } else {
    showSoundExpression();
  }
  welcomeMessageShown = true;
}

function playSoundExpression() {
  music.play(
    soundExpressions[soundExpressionIndex],
    music.PlaybackMode.UntilDone
  );
}

function showSoundExpression() {
  if (isDisplayConnected) {
    kitronik_VIEW128x64.setFontSize(kitronik_VIEW128x64.FontSelection.Normal);
    kitronik_VIEW128x64.show(`SOUND EXPESSION ${soundExpressionIndex + 1}`);
    kitronik_VIEW128x64.show(
      `VOL ${volume}`,
      1,
      kitronik_VIEW128x64.ShowAlign.Right
    );
    kitronik_VIEW128x64.show("A: NEXT", 8);
    kitronik_VIEW128x64.show("B: PLAY", 8, kitronik_VIEW128x64.ShowAlign.Right);
    kitronik_VIEW128x64.setFontSize(kitronik_VIEW128x64.FontSelection.Big);
    kitronik_VIEW128x64.clearLine(2);
    kitronik_VIEW128x64.show(soundExpressionsNames[soundExpressionIndex], 2);
  } else {
    basic.showString(
      `${soundExpressionIndex + 1}.${
        soundExpressionsNames[soundExpressionIndex]
      }`
    );
  }
}

input.onButtonPressed(Button.A, function () {
  soundExpressionIndex += 1;
  if (soundExpressionIndex >= soundExpressionsNames.length) {
    soundExpressionIndex = 0;
  }
  showSoundExpression();
});

input.onButtonPressed(Button.B, function () {
  playSoundExpression();
});

input.onLogoEvent(TouchButtonEvent.Pressed, function () {
  showSoundExpression();
});

forever(function () {
  time = input.runningTime();
  if (time - lastTime < 300 && lastTime != 0) return;
  lastTime = time;
  let displayConnected = _isDisplayConnected();
  if (displayConnected != isDisplayConnected) {
    isDisplayConnected = displayConnected;
    if (displayConnected) {
      connectDisplay();
    }
  }
  welcome();
});
