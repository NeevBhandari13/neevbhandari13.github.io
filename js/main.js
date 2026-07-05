/* =========================================================
   NEEVVILLE — Boot & input (keyboard + touch)
   ========================================================= */
(function () {
  'use strict';

  /* ---- direction input: stack of held directions ---- */
  var held = [];
  window.Input = {
    press: function (dir) {
      if (held.indexOf(dir) === -1) held.push(dir);
    },
    release: function (dir) {
      var i = held.indexOf(dir);
      if (i !== -1) held.splice(i, 1);
    },
    current: function () { return held.length ? held[held.length - 1] : null; },
  };

  var KEY_DIRS = {
    ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
    w: 'up', s: 'down', a: 'left', d: 'right',
    W: 'up', S: 'down', A: 'left', D: 'right',
  };
  var A_KEYS = ['Enter', ' ', 'z', 'Z', 'e', 'E'];
  var B_KEYS = ['x', 'X', 'Backspace'];

  function titleVisible() { return !document.getElementById('title').hidden; }

  function dismissTitle() {
    document.getElementById('title').hidden = true;
  }

  function onA() {
    if (titleVisible()) { dismissTitle(); return; }
    if (Dialogue.isOpen()) { Dialogue.advance(); return; }
    if (UI.isOpen()) { UI.handleKey('a'); return; }
    Engine.interact();
  }

  function onB() {
    if (Dialogue.isOpen()) { Dialogue.advance(); return; }
    if (UI.isOpen()) { UI.handleKey('b'); return; }
  }

  function onMenu() {
    if (titleVisible()) { dismissTitle(); return; }
    if (Dialogue.isOpen()) { Dialogue.close(); return; }
    UI.toggleMenu();
  }

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    var dir = KEY_DIRS[e.key];
    if (dir) {
      e.preventDefault();
      if (titleVisible()) return;
      if (UI.isOpen()) { if (!e.repeat) UI.handleKey(dir); return; }
      if (Dialogue.isOpen()) return;
      Input.press(dir);
      return;
    }
    if (A_KEYS.indexOf(e.key) !== -1) {
      e.preventDefault();
      if (!e.repeat) onA();
      return;
    }
    if (B_KEYS.indexOf(e.key) !== -1) {
      e.preventDefault();
      if (!e.repeat) onB();
      return;
    }
    if (e.key === 'Escape' || e.key === 'm' || e.key === 'M') {
      e.preventDefault();
      if (!e.repeat) onMenu();
    }
  });

  document.addEventListener('keyup', function (e) {
    var dir = KEY_DIRS[e.key];
    if (dir) Input.release(dir);
  });

  /* ---- touch / on-screen controls ---- */
  function bindHold(id, dir) {
    var el = document.getElementById(id);
    if (!el) return;
    var press = function (e) { e.preventDefault(); Input.press(dir); };
    var release = function (e) { e.preventDefault(); Input.release(dir); };
    el.addEventListener('pointerdown', press);
    el.addEventListener('pointerup', release);
    el.addEventListener('pointerleave', release);
    el.addEventListener('pointercancel', release);
  }

  function initTouch() {
    bindHold('dpad-up', 'up');
    bindHold('dpad-down', 'down');
    bindHold('dpad-left', 'left');
    bindHold('dpad-right', 'right');
    var aBtn = document.getElementById('btn-a');
    aBtn.addEventListener('pointerdown', function (e) { e.preventDefault(); onA(); });
  }

  /* ---- boot ---- */
  document.addEventListener('DOMContentLoaded', function () {
    Dialogue.init();
    UI.init();
    Engine.init(document.getElementById('game'));
    initTouch();

    document.getElementById('title').addEventListener('click', dismissTitle);

    Engine.start();
  });
})();
