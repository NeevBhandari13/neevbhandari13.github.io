/* =========================================================
   NEEVVILLE — Engine: loop, movement, NPCs, camera, render
   ========================================================= */
(function () {
  'use strict';

  var T = 16;
  var VIEW_W = 20, VIEW_H = 15;      // tiles visible
  var MOVE_MS = 180;                  // ms per tile step

  var canvas, ctx;
  var player, npcs = [];
  var lastTime = 0;
  var camX = 0, camY = 0;

  function makeEntity(tx, ty, sprites, dir) {
    return {
      tx: tx, ty: ty,            // current tile
      x: tx * T, y: ty * T,      // pixel position
      dir: dir || 'down',
      moving: false,
      from: null, to: null, t: 0,
      parity: 0,
      sprites: sprites,
    };
  }

  function occupied(tx, ty, self) {
    if (player !== self) {
      var ptx = player.moving ? player.to.x : player.tx;
      var pty = player.moving ? player.to.y : player.ty;
      if ((player.tx === tx && player.ty === ty) || (ptx === tx && pty === ty)) return true;
    }
    for (var i = 0; i < npcs.length; i++) {
      var n = npcs[i];
      if (n === self) continue;
      var ntx = n.moving ? n.to.x : n.tx;
      var nty = n.moving ? n.to.y : n.ty;
      if ((n.tx === tx && n.ty === ty) || (ntx === tx && nty === ty)) return true;
    }
    return false;
  }

  var DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

  function startMove(e, dir) {
    var d = DIRS[dir];
    e.dir = dir;
    var nx = e.tx + d[0], ny = e.ty + d[1];
    if (GameMap.solid(nx, ny) || occupied(nx, ny, e)) return false;
    e.moving = true;
    e.from = { x: e.tx, y: e.ty };
    e.to = { x: nx, y: ny };
    e.t = 0;
    e.parity ^= 1;
    return true;
  }

  function updateEntity(e, dt) {
    if (!e.moving) return;
    e.t += dt / MOVE_MS;
    if (e.t >= 1) {
      e.t = 0;
      e.moving = false;
      e.tx = e.to.x;
      e.ty = e.to.y;
      e.x = e.tx * T;
      e.y = e.ty * T;
    } else {
      e.x = (e.from.x + (e.to.x - e.from.x) * e.t) * T;
      e.y = (e.from.y + (e.to.y - e.from.y) * e.t) * T;
    }
  }

  function entityFrame(e) {
    var frames = e.sprites[e.dir];
    if (!e.moving) return frames[0];
    var step = frames.length === 4 ? (e.parity ? frames[1] : frames[3]) : frames[1];
    return e.t < 0.6 ? step : frames[0];
  }

  /* ---------------- player control ---------------- */

  function modalOpen() {
    return Dialogue.isOpen() || UI.isOpen() || !document.getElementById('title').hidden;
  }

  function tryPlayerMove(dir) {
    var d = DIRS[dir];
    player.dir = dir;
    var nx = player.tx + d[0], ny = player.ty + d[1];
    var door = GameMap.doorAt(nx, ny);
    if (door) { enterBuilding(door); return; }
    startMove(player, dir);
  }

  var lastDoor = null;
  function enterBuilding(b) {
    if (lastDoor === b) return; // avoid instant re-trigger while held
    lastDoor = b;
    setTimeout(function () { lastDoor = null; }, 600);
    UI.openPanel(b.id);
  }

  function facingTile() {
    var d = DIRS[player.dir];
    return { x: player.tx + d[0], y: player.ty + d[1] };
  }

  /* ---------------- NPCs ---------------- */

  function initNpcs() {
    npcs = GameMap.npcDefs.map(function (def) {
      var e = makeEntity(def.x, def.y, Sprites.npcs[def.sprite], def.dir);
      e.def = def;
      e.wanderTimer = 1000 + Math.random() * 2000;
      return e;
    });
  }

  function updateNpcs(dt) {
    npcs.forEach(function (n) {
      updateEntity(n, dt);
      var w = n.def.wander;
      if (!w || n.moving) return;
      n.wanderTimer -= dt;
      if (n.wanderTimer > 0) return;
      n.wanderTimer = 1200 + Math.random() * 2200;
      var dirs = Object.keys(DIRS);
      var dir = dirs[(Math.random() * 4) | 0];
      var d = DIRS[dir];
      var nx = n.tx + d[0], ny = n.ty + d[1];
      if (nx < w.minX || nx > w.maxX || ny < w.minY || ny > w.maxY) { n.dir = dir; return; }
      if (GameMap.doorAt(nx, ny)) return;
      startMove(n, dir);
    });
  }

  /* ---------------- interaction ---------------- */

  function interact() {
    var f = facingTile();
    // NPC?
    for (var i = 0; i < npcs.length; i++) {
      var n = npcs[i];
      if (!n.moving && n.tx === f.x && n.ty === f.y) {
        // face the player
        n.dir = { up: 'down', down: 'up', left: 'right', right: 'left' }[player.dir];
        Dialogue.open(n.def.pages);
        return true;
      }
    }
    var sign = GameMap.signAt(f.x, f.y);
    if (sign) { Dialogue.open(sign.pages); return true; }
    var door = GameMap.doorAt(f.x, f.y);
    if (door) { enterBuilding(door); return true; }
    return false;
  }

  /* ---------------- render ---------------- */

  function draw(time) {
    var animFrame = ((time / 450) | 0) % 2;

    // camera centered on player, clamped to map
    camX = Math.round(player.x + T / 2 - (VIEW_W * T) / 2);
    camY = Math.round(player.y + T / 2 - (VIEW_H * T) / 2);
    camX = Math.max(0, Math.min(GameMap.W * T - VIEW_W * T, camX));
    camY = Math.max(0, Math.min(GameMap.H * T - VIEW_H * T, camY));

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(-camX, -camY);

    var x0 = (camX / T) | 0, y0 = (camY / T) | 0;
    GameMap.draw(ctx, x0, y0, x0 + VIEW_W, y0 + VIEW_H, animFrame);

    // entities sorted by y so lower ones draw in front
    var ents = npcs.concat([player]).sort(function (a, b) { return a.y - b.y; });
    ents.forEach(function (e) {
      ctx.drawImage(entityFrame(e), Math.round(e.x), Math.round(e.y) - 2);
    });

    ctx.restore();
  }

  /* ---------------- pointer interaction ---------------- */

  function onCanvasClick(ev) {
    if (modalOpen()) return;
    var rect = canvas.getBoundingClientRect();
    var wx = (ev.clientX - rect.left) * (canvas.width / rect.width) + camX;
    var wy = (ev.clientY - rect.top) * (canvas.height / rect.height) + camY;
    var tx = (wx / T) | 0, ty = (wy / T) | 0;

    var b = GameMap.buildingAt(tx, ty) || GameMap.doorAt(tx, ty);
    if (b) { enterBuilding(b); return; }

    var sign = GameMap.signAt(tx, ty);
    if (sign) { Dialogue.open(sign.pages); return; }

    for (var i = 0; i < npcs.length; i++) {
      var n = npcs[i];
      if (n.tx === tx && n.ty === ty) {
        Dialogue.open(n.def.pages);
        return;
      }
    }
  }

  /* ---------------- main loop ---------------- */

  function step(dt, time) {
    if (!modalOpen()) {
      updateEntity(player, dt);
      if (!player.moving) {
        var dir = Input.current();
        if (dir) tryPlayerMove(dir);
      }
      updateNpcs(dt);
    }
    draw(time);
  }

  function loop(time) {
    var dt = Math.min(50, time - lastTime);
    lastTime = time;
    step(dt, time);
    requestAnimationFrame(loop);
  }

  window.Engine = {
    init: function (canvasEl) {
      canvas = canvasEl;
      canvas.width = VIEW_W * T;
      canvas.height = VIEW_H * T;
      ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      canvas.addEventListener('click', onCanvasClick);
      canvas.style.cursor = 'pointer';
      Sprites.init();
      player = makeEntity(13, 15, Sprites.player, 'up');
      initNpcs();
    },
    start: function () {
      requestAnimationFrame(function (t) { lastTime = t; requestAnimationFrame(loop); });
    },
    interact: interact,
    modalOpen: modalOpen,
    step: step, // manual tick (used by automated tests)
    debug: function () {
      return {
        player: { tx: player.tx, ty: player.ty, dir: player.dir, moving: player.moving },
        modal: modalOpen(),
        input: Input.current(),
      };
    },
  };
})();
