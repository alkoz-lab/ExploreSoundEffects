function playSoundEffect () {
    let soundExpression = new SoundExpression(soundEffectNames[soundEffectIndex])
    music.play(soundExpression, music.PlaybackMode.UntilDone)
}
function showSoundEffect () {
    kitronik_VIEW128x64.setFontSize(kitronik_VIEW128x64.FontSelection.Normal)
    kitronik_VIEW128x64.show("SOUND EFFECT:")
    kitronik_VIEW128x64.show("A: NEXT", 8)
    kitronik_VIEW128x64.show("B: PLAY", 8, kitronik_VIEW128x64.ShowAlign.Right)
    kitronik_VIEW128x64.setFontSize(kitronik_VIEW128x64.FontSelection.Big)
    kitronik_VIEW128x64.clearLine(2)
    kitronik_VIEW128x64.show(soundEffectNames[soundEffectIndex], 2)
}
input.onButtonPressed(Button.A, function () {
    soundEffectIndex += 1
    if (soundEffectIndex >= soundEffectNames.length) {
        soundEffectIndex = 1
    }
    showSoundEffect()
})
input.onButtonPressed(Button.B, function () {
    playSoundEffect()
})
let soundEffectNames: string[] = []
let soundEffectIndex = 0
soundEffectNames = [
"giggle",
"happy",
"hello",
"mysterious",
"sad",
"slide",
"soaring",
"spring",
"twinkle",
"yawn"
]
music.setVolume(128)
kitronik_VIEW128x64.controlDisplayOnOff(kitronik_VIEW128x64.onOff(true))
showSoundEffect()
