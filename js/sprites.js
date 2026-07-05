/* =========================================================
   NEEVVILLE — Sprites & tiles
   All art is original pixel art generated in code (16x16),
   in the style of Game Boy-era RPGs. No third-party assets.
   ========================================================= */
(function () {
  'use strict';

  var T = 16; // logical tile size in px

  function canvas(w, h) {
    var c = document.createElement('canvas');
    c.width = w || T;
    c.height = h || T;
    return c;
  }

  /* Paint a sprite from rows of palette characters. '.' = transparent. */
  function px(rows, palette) {
    var c = canvas(rows[0].length, rows.length);
    var g = c.getContext('2d');
    for (var y = 0; y < rows.length; y++) {
      for (var x = 0; x < rows[y].length; x++) {
        var ch = rows[y][x];
        if (ch === '.') continue;
        g.fillStyle = palette[ch];
        g.fillRect(x, y, 1, 1);
      }
    }
    return c;
  }

  function mirror(src) {
    var c = canvas(src.width, src.height);
    var g = c.getContext('2d');
    g.translate(src.width, 0);
    g.scale(-1, 1);
    g.drawImage(src, 0, 0);
    return c;
  }

  /* Deterministic pseudo-random for tile speckles */
  function noise(i) {
    var v = Math.sin(i * 127.1) * 43758.5453;
    return v - Math.floor(v);
  }

  /* ---------------- character templates ---------------- */
  /* chars: c=cap/hair top, C=cap brim/hair shade, s=skin, E=eye,
            h=dark (hair sides/shoes), b=shirt, B=pants            */

  var DOWN_A = [
    '................',
    '.....cccccc.....',
    '....cccccccc....',
    '...cccccccccc...',
    '...CCCCCCCCCC...',
    '...hssssssssh...',
    '...hsEssssEsh...',
    '....ssssssss....',
    '...bbbbbbbbbb...',
    '..sbbbbbbbbbbs..',
    '..sbbbbbbbbbbs..',
    '...bbbbbbbbbb...',
    '....BBBBBBBB....',
    '....BBB..BBB....',
    '....hhh..hhh....',
    '................',
  ];
  var DOWN_B = [
    '................',
    '.....cccccc.....',
    '....cccccccc....',
    '...cccccccccc...',
    '...CCCCCCCCCC...',
    '...hssssssssh...',
    '...hsEssssEsh...',
    '....ssssssss....',
    '...bbbbbbbbbb...',
    '..sbbbbbbbbbbs..',
    '..sbbbbbbbbbbs..',
    '...bbbbbbbbbb...',
    '....BBBBBBBB....',
    '....BBB..BB.....',
    '....hhh...hh....',
    '................',
  ];
  var UP_A = [
    '................',
    '.....cccccc.....',
    '....cccccccc....',
    '...cccccccccc...',
    '...cccccccccc...',
    '...hhhhhhhhhh...',
    '...hhhhhhhhhh...',
    '....hhhhhhhh....',
    '...bbbbbbbbbb...',
    '..sbbbbbbbbbbs..',
    '..sbbbbbbbbbbs..',
    '...bbbbbbbbbb...',
    '....BBBBBBBB....',
    '....BBB..BBB....',
    '....hhh..hhh....',
    '................',
  ];
  var UP_B = [
    '................',
    '.....cccccc.....',
    '....cccccccc....',
    '...cccccccccc...',
    '...cccccccccc...',
    '...hhhhhhhhhh...',
    '...hhhhhhhhhh...',
    '....hhhhhhhh....',
    '...bbbbbbbbbb...',
    '..sbbbbbbbbbbs..',
    '..sbbbbbbbbbbs..',
    '...bbbbbbbbbb...',
    '....BBBBBBBB....',
    '.....BB..BBB....',
    '....hh...hhh....',
    '................',
  ];
  var LEFT_A = [
    '................',
    '.....cccccc.....',
    '....cccccccc....',
    '....cccccccc....',
    '..CCCCCCcccc....',
    '....ssssshhh....',
    '....sEsssshh....',
    '.....sssshhh....',
    '....bbbbbbbb....',
    '....sbbbbbbb....',
    '....sbbbbbbb....',
    '....bbbbbbbb....',
    '.....BBBBBB.....',
    '.....BB..BB.....',
    '.....hh..hh.....',
    '................',
  ];
  var LEFT_B = [
    '................',
    '.....cccccc.....',
    '....cccccccc....',
    '....cccccccc....',
    '..CCCCCCcccc....',
    '....ssssshhh....',
    '....sEsssshh....',
    '.....sssshhh....',
    '....bbbbbbbb....',
    '....sbbbbbbb....',
    '....sbbbbbbb....',
    '....bbbbbbbb....',
    '.....BBBBBB.....',
    '....BB...BBB....',
    '...hh.....hh....',
    '................',
  ];

  var PLAYER_PAL = {
    c: '#d64545', C: '#9e2f2f', s: '#f2c9a0', E: '#22232e',
    h: '#4a3123', b: '#3b5dd1', B: '#28347a',
  };

  function villagerPal(hair, shirt) {
    return {
      c: hair, C: shade(hair), s: '#f2c9a0', E: '#22232e',
      h: shade(hair), b: shirt, B: '#555a6e',
    };
  }

  function shade(hex) {
    var n = parseInt(hex.slice(1), 16);
    var r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return 'rgb(' + (r * 0.62 | 0) + ',' + (g * 0.62 | 0) + ',' + (b * 0.62 | 0) + ')';
  }

  function buildCharacter(pal) {
    var downA = px(DOWN_A, pal), downB = px(DOWN_B, pal);
    var upA = px(UP_A, pal), upB = px(UP_B, pal);
    var leftA = px(LEFT_A, pal), leftB = px(LEFT_B, pal);
    return {
      down: [downA, downB, downA, mirror(downB)],
      up: [upA, upB, upA, mirror(upB)],
      left: [leftA, leftB],
      right: [mirror(leftA), mirror(leftB)],
    };
  }

  /* Original follower critter: BYTE the code-fox (2-frame bounce) */
  var PET_ROWS = [
    '................',
    '................',
    '...oo......oo...',
    '..offo....offo..',
    '..offfoooofffo..',
    '.offffffffffffo.',
    '.ofEffffffffEfo.',
    '.offfwwwwwwfffo.',
    '.offfwwwwwwfffo.',
    '..offwwwwwwffo..',
    '..offffffffffo..',
    '...ooffffffoo...',
    '.....oooooo.....',
    '....oFo..oFo....',
    '................',
    '................',
  ];
  var PET_PAL = { o: '#4a2d18', f: '#e8944a', F: '#c26a2e', w: '#f8e8d0', E: '#22232e' };

  function buildPet() {
    var a = px(PET_ROWS, PET_PAL);
    var b = canvas(a.width, a.height);
    b.getContext('2d').drawImage(a, 0, -1); // hop frame
    var frames = [a, b];
    return { down: frames, up: frames, left: frames, right: frames };
  }

  /* ---------------- tile painters ---------------- */

  var COL = {
    grass: '#8ecc5a', grassDark: '#7ab948',
    path: '#e8d8a0', pathDark: '#d8c488', pathEdge: '#c0aa6e',
    trunk: '#8a5a2a', leafDark: '#2e8a3e', leaf: '#4fae53', leafLight: '#6cc46c',
    water: '#4a90d9', waterLight: '#7db8ec', waterDark: '#3a78bd',
    wall: '#ece4cc', wallDark: '#c4ba9c', wallLine: '#a89a78',
    door: '#7a4e22', doorDark: '#5a3816', glass: '#9ed4f0', frame: '#6e5a3a',
    wood: '#c8a05a', woodDark: '#8a6a34',
    outline: '#274020',
  };

  function grassBase(g, seed) {
    g.fillStyle = COL.grass;
    g.fillRect(0, 0, T, T);
    g.fillStyle = COL.grassDark;
    for (var i = 0; i < 7; i++) {
      var x = (noise(seed + i) * T) | 0;
      var y = (noise(seed + i + 50) * T) | 0;
      g.fillRect(x, y, 2, 1);
    }
  }

  function makeGrass(seed) {
    var c = canvas();
    grassBase(c.getContext('2d'), seed);
    return c;
  }

  function makeFlower(frame) {
    var c = makeGrass(9 + frame);
    var g = c.getContext('2d');
    function bloom(x, y, petal) {
      g.fillStyle = petal;
      g.fillRect(x - 1, y, 1, 1); g.fillRect(x + 1, y, 1, 1);
      g.fillRect(x, y - 1, 1, 1); g.fillRect(x, y + 1, 1, 1);
      g.fillStyle = '#f5e04a';
      g.fillRect(x, y, 1, 1);
    }
    var sway = frame ? 1 : 0;
    bloom(4 + sway, 5, '#e85a5a');
    bloom(11 - sway, 11, '#e8e8f8');
    return c;
  }

  function makePath() {
    var c = canvas();
    var g = c.getContext('2d');
    g.fillStyle = COL.path;
    g.fillRect(0, 0, T, T);
    g.fillStyle = COL.pathDark;
    for (var i = 0; i < 6; i++) {
      g.fillRect((noise(i + 3) * 14) | 0, (noise(i + 77) * 14) | 0, 2, 2);
    }
    g.fillStyle = COL.pathEdge;
    g.fillRect(0, 0, T, 1);
    return c;
  }

  var TREE_ROWS = [
    '................',
    '.....oooooo.....',
    '...ooDDDDDDoo...',
    '..oDDLLLLLLDDo..',
    '..oDLHHLLLLLDo..',
    '.oDLLHHLLLLLLDo.',
    '.oDLLLLLLLDLLDo.',
    '.oDLLLLLLDDLLDo.',
    '.oDDLLLLLLLLDDo.',
    '..oDDLLLLLLDDo..',
    '...ooDDDDDDoo...',
    '.....oooooo.....',
    '......ottT......',
    '......ottT......',
    '.....oottTo.....',
    '................',
  ];
  var TREE_PAL = {
    o: '#1c5c28', D: '#2e8a3e', L: '#4fae53', H: '#7ccb6f',
    t: '#8a5a2a', T: '#5a3816',
  };

  function makeTree(seed) {
    var c = makeGrass(seed);
    var g = c.getContext('2d');
    g.drawImage(px(TREE_ROWS, TREE_PAL), 0, 0);
    return c;
  }

  /* Classic walkable tall grass: dark chevron tufts */
  function makeTallGrass(frame) {
    var c = canvas();
    var g = c.getContext('2d');
    g.fillStyle = COL.grass;
    g.fillRect(0, 0, T, T);
    g.fillStyle = COL.grassDark;
    var sway = frame ? 1 : 0;
    for (var row = 0; row < 3; row++) {
      for (var col = 0; col < 3; col++) {
        var x = col * 5 + 1 + ((row % 2) ? 2 : 0) + (row === 1 ? sway : 0);
        var y = row * 5 + 1;
        // small tuft: /\ shape
        g.fillRect(x, y + 2, 1, 2);
        g.fillRect(x + 1, y + 1, 1, 3);
        g.fillRect(x + 2, y, 1, 4);
        g.fillRect(x + 3, y + 1, 1, 3);
        g.fillRect(x + 4, y + 2, 1, 2);
      }
    }
    g.fillStyle = '#5ea63c';
    g.fillRect(0, 14, T, 2);
    return c;
  }

  function makeWater(frame) {
    var c = canvas();
    var g = c.getContext('2d');
    g.fillStyle = COL.water;
    g.fillRect(0, 0, T, T);
    g.fillStyle = COL.waterLight;
    var off = frame ? 3 : 0;
    g.fillRect(1 + off, 3, 4, 1);
    g.fillRect(9 + (frame ? -2 : 0), 8, 4, 1);
    g.fillRect(3 + off, 13, 4, 1);
    g.fillStyle = COL.waterDark;
    g.fillRect(6, 5, 3, 1);
    g.fillRect(12, 11, 3, 1);
    return c;
  }

  function makeWall() {
    var c = canvas();
    var g = c.getContext('2d');
    g.fillStyle = COL.wall;
    g.fillRect(0, 0, T, T);
    g.fillStyle = COL.wallLine;
    g.fillRect(0, 5, T, 1);
    g.fillRect(0, 11, T, 1);
    g.fillRect(8, 0, 1, 5);
    g.fillRect(3, 6, 1, 5);
    g.fillRect(12, 6, 1, 5);
    g.fillRect(8, 12, 1, 4);
    return c;
  }

  function makeWindow(wall) {
    var c = canvas();
    var g = c.getContext('2d');
    g.drawImage(wall, 0, 0);
    g.fillStyle = COL.frame;
    g.fillRect(3, 4, 10, 9);
    g.fillStyle = COL.glass;
    g.fillRect(4, 5, 8, 7);
    g.fillStyle = '#ffffff';
    g.fillRect(5, 6, 2, 2);
    return c;
  }

  function makeDoor(wall) {
    var c = canvas();
    var g = c.getContext('2d');
    g.drawImage(wall, 0, 0);
    g.fillStyle = COL.doorDark;
    g.fillRect(3, 3, 10, 13);
    g.fillStyle = COL.door;
    g.fillRect(4, 4, 8, 12);
    g.fillStyle = '#f5d76a';
    g.fillRect(10, 9, 1, 2); // handle
    return c;
  }

  /* Pokemon-style roofs: top row has a ridge, bottom row has eaves */
  function makeRoofTop(color) {
    var c = canvas();
    var g = c.getContext('2d');
    var dark = shade(color);
    g.fillStyle = color;
    g.fillRect(0, 0, T, T);
    g.fillStyle = '#22232e';
    g.fillRect(0, 0, T, 1);                 // outline
    g.fillStyle = lighten(color);
    g.fillRect(0, 1, T, 2);                 // ridge highlight
    g.fillStyle = dark;
    for (var x = 0; x < T; x += 4) g.fillRect(x, 3, 1, 13); // shingle lines
    g.fillRect(0, 8, T, 1);
    return c;
  }

  function makeRoofBottom(color) {
    var c = canvas();
    var g = c.getContext('2d');
    var dark = shade(color);
    g.fillStyle = color;
    g.fillRect(0, 0, T, T);
    g.fillStyle = dark;
    for (var x = 0; x < T; x += 4) g.fillRect(x, 0, 1, 12);
    g.fillRect(0, 5, T, 1);
    g.fillRect(0, 12, T, 2);                // eave shadow
    g.fillStyle = '#22232e';
    g.fillRect(0, 14, T, 2);                // eave outline
    return c;
  }

  function lighten(hex) {
    var n = parseInt(hex.slice(1), 16);
    var r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    var f = function (v) { return Math.min(255, (v * 1.35 + 22) | 0); };
    return 'rgb(' + f(r) + ',' + f(g) + ',' + f(b) + ')';
  }

  function makeFence(seed) {
    var c = makeGrass(seed);
    var g = c.getContext('2d');
    g.fillStyle = COL.wood;
    g.fillRect(2, 5, 3, 9); g.fillRect(11, 5, 3, 9);
    g.fillRect(0, 7, T, 2);
    g.fillStyle = COL.woodDark;
    g.fillRect(2, 13, 3, 1); g.fillRect(11, 13, 3, 1);
    return c;
  }

  function makeSign(seed) {
    var c = makeGrass(seed);
    var g = c.getContext('2d');
    g.fillStyle = COL.woodDark;
    g.fillRect(7, 9, 2, 6);
    g.fillStyle = COL.wood;
    g.fillRect(2, 2, 12, 8);
    g.fillStyle = COL.woodDark;
    g.fillRect(2, 2, 12, 1); g.fillRect(2, 9, 12, 1);
    g.fillRect(4, 4, 8, 1); g.fillRect(4, 6, 6, 1);
    return c;
  }

  /* ---------------- public API ---------------- */

  window.Sprites = {
    TILE: T,
    init: function () {
      var wall = makeWall();
      this.tiles = {
        grass: [makeGrass(1), makeGrass(2), makeGrass(3)],
        flower: [makeFlower(0), makeFlower(1)],
        tallgrass: [makeTallGrass(0), makeTallGrass(1)],
        path: makePath(),
        tree: makeTree(4),
        water: [makeWater(0), makeWater(1)],
        fence: makeFence(5),
        sign: makeSign(6),
        wall: wall,
        window: makeWindow(wall),
        door: makeDoor(wall),
      };
      this.roofs = {}; // color -> {top, bottom}, built lazily
      this.player = buildCharacter(PLAYER_PAL);
      this.pet = buildPet();
      this.npcs = {
        guide: buildCharacter(villagerPal('#6a4a8e', '#4a9e6e')),
        scholar: buildCharacter(villagerPal('#8a8a92', '#8a5adb')),
        fisher: buildCharacter(villagerPal('#3a5a8a', '#d6a545')),
        kid: buildCharacter(villagerPal('#d6903a', '#d64545')),
      };
    },
    roof: function (color) {
      if (!this.roofs[color]) {
        this.roofs[color] = { top: makeRoofTop(color), bottom: makeRoofBottom(color) };
      }
      return this.roofs[color];
    },
  };
})();
