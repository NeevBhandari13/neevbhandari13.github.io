/* =========================================================
   NEEVVILLE — Dialogue box (typewriter, multi-page)
   ========================================================= */
(function () {
  'use strict';

  var box, textEl, cursorEl;
  var pages = [], pageIndex = 0, charIndex = 0;
  var typing = false, timer = null, onDone = null;
  var SPEED = 18; // ms per character

  function startPage() {
    charIndex = 0;
    typing = true;
    textEl.textContent = '';
    cursorEl.style.visibility = 'hidden';
    clearInterval(timer);
    timer = setInterval(function () {
      var page = pages[pageIndex];
      charIndex++;
      textEl.textContent = page.slice(0, charIndex);
      if (charIndex >= page.length) finishPage();
    }, SPEED);
  }

  function finishPage() {
    clearInterval(timer);
    typing = false;
    textEl.textContent = pages[pageIndex];
    cursorEl.style.visibility = 'visible';
  }

  window.Dialogue = {
    init: function () {
      box = document.getElementById('dialogue');
      textEl = box.querySelector('.dialogue-text');
      cursorEl = box.querySelector('.dialogue-cursor');
      box.addEventListener('click', function () { Dialogue.advance(); });
    },

    open: function (newPages, done) {
      pages = newPages.slice();
      pageIndex = 0;
      onDone = done || null;
      box.hidden = false;
      startPage();
    },

    isOpen: function () { return box && !box.hidden; },

    advance: function () {
      if (!this.isOpen()) return;
      if (typing) { finishPage(); return; }
      pageIndex++;
      if (pageIndex < pages.length) {
        startPage();
      } else {
        this.close();
      }
    },

    close: function () {
      clearInterval(timer);
      box.hidden = true;
      typing = false;
      var cb = onDone;
      onDone = null;
      if (cb) cb();
    },
  };
})();
