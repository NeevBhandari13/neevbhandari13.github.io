/* =========================================================
   NEEVVILLE — tiny Game Boy-style sound effects (WebAudio)
   Square-wave blips generated in code; no audio files.
   ========================================================= */
(function () {
  'use strict';

  var ctx = null;

  function ac() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, dur, delay) {
    try {
      var a = ac();
      if (!a) return;
      var t = a.currentTime + (delay || 0);
      var osc = a.createOscillator();
      var gain = a.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.035, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.connect(gain).connect(a.destination);
      osc.start(t);
      osc.stop(t + dur);
    } catch (e) { /* audio is decorative — never break the game */ }
  }

  window.SFX = {
    blip: function () { tone(880, 0.055); },                                  // dialogue advance
    select: function () { tone(660, 0.05); tone(990, 0.07, 0.055); },         // menu confirm
    open: function () { tone(740, 0.05); tone(1046, 0.06, 0.05); },           // menu open
    door: function () { tone(523, 0.07); tone(659, 0.07, 0.07); tone(784, 0.09, 0.14); },
  };
})();
