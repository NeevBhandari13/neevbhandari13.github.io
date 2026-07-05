/* =========================================================
   NEEVVILLE — Town map: ground layer, buildings, signs, NPCs
   Legend: . grass  , flowers  = path  T tree  W water
           F fence  g tall grass (walkable)
   ========================================================= */
(function () {
  'use strict';

  var ROWS = [
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTT', // 0
    'T..........................T', // 1
    'T.........T......T.........T', // 2
    'T...........gggg...........T', // 3
    'T.........,,....,,.........T', // 4
    'T..........................T', // 5
    'T....=..........,.....=....T', // 6
    'T.========================.T', // 7
    'T........=........=........T', // 8
    'T........=........=........T', // 9
    'T........=........=........T', // 10
    'T........=........=........T', // 11
    'T........=...=....=........T', // 12
    'T........=...=....=........T', // 13
    'T....=...=...=....=...=....T', // 14
    'T.========================.T', // 15
    'T..WWWW............,,.gggg.T', // 16
    'T..WWWW..,,...........gggg.T', // 17
    'T..WWWW...............gggg.T', // 18
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTT', // 19
  ];

  var BUILDINGS = [
    { id: 'experience', label: 'CAREER GYM', x: 3, y: 2, w: 6, h: 4, roof: '#d64545', door: { x: 5, y: 5 } },
    { id: 'projects', label: 'RESEARCH LAB', x: 19, y: 2, w: 6, h: 4, roof: '#8e5ad6', door: { x: 22, y: 5 } },
    { id: 'skills', label: 'ITEM MART', x: 11, y: 8, w: 5, h: 4, roof: '#4576d6', door: { x: 13, y: 11 } },
    { id: 'education', label: 'TRAINER SCHOOL', x: 3, y: 10, w: 5, h: 4, roof: '#d6a545', door: { x: 5, y: 13 } },
    { id: 'contact', label: 'WELLNESS CENTER', x: 20, y: 10, w: 5, h: 4, roof: '#d66a9e', door: { x: 22, y: 13 } },
  ];

  var SIGNS = [
    { x: 4, y: 6, pages: ['CAREER GYM', '"Experience is the best badge."', 'Leaders inside: ANZ, Monash DeepNeuron, PwC, Bank of Melbourne, Anytime Fitness.'] },
    { x: 21, y: 6, pages: ['RESEARCH LAB', 'Home of the PROJECTDEX.', '5 entries discovered so far.'] },
    { x: 12, y: 12, pages: ['ITEM MART', 'Fully stocked with SKILLS.', 'Sorry, no Rare Candies.'] },
    { x: 4, y: 14, pages: ['TRAINER SCHOOL', 'Monash University x UC Berkeley.', 'Double degrees taught here.'] },
    { x: 21, y: 14, pages: ['WELLNESS CENTER', '"We heal hiring pipelines."', 'Contact NEEV inside!'] },
    { x: 14, y: 14, pages: ['Welcome to NEEVVILLE!', 'Home of NEEV BHANDARI — Backend Engineer, Melbourne AU.', 'Population: 1 engineer, 4 friendly locals.'] },
  ];

  var NPCS = [
    {
      id: 'guide', sprite: 'guide', x: 11, y: 14, dir: 'down',
      pages: [
        'Welcome to NEEVVILLE, trainer!',
        'The CAREER GYM (north-west) holds NEEV\'s badges — five employers\' worth of experience.',
        'The RESEARCH LAB (north-east) keeps the PROJECTDEX. The ITEM MART stocks his skills.',
        'In a hurry? Open the MENU for the plain resume and PDF. Recruiters love shortcuts.',
      ],
    },
    {
      id: 'scholar', sprite: 'scholar', x: 16, y: 10, dir: 'down',
      wander: { minX: 16, maxX: 17, minY: 8, maxY: 13 },
      pages: [
        'I\'m training for the CLOUD BADGE!',
        'NEEV is going for it too — the Google Cloud Associate Cloud Engineer certification.',
        'His attempt is still IN PROGRESS. Respect the grind!',
      ],
    },
    {
      id: 'fisher', sprite: 'fisher', x: 7, y: 16, dir: 'down',
      pages: [
        'I\'m fishing for legacy Confluence pages...',
        'NEEV wrote a migration script that reeled in about 200 hours of manual work. In one cast!',
      ],
    },
    {
      id: 'kid', sprite: 'kid', x: 8, y: 12, dir: 'right',
      pages: [
        'Psst! The ITEM MART stocks SEVEN programming languages.',
        'I\'m saving up for C++. The shopkeeper says it has high attack but a steep learning curve.',
      ],
    },
  ];

  var W = ROWS[0].length, H = ROWS.length;

  var buildingCells = {}; // "x,y" -> building
  var doorCells = {};     // "x,y" -> building
  BUILDINGS.forEach(function (b) {
    for (var y = b.y; y < b.y + b.h; y++)
      for (var x = b.x; x < b.x + b.w; x++)
        buildingCells[x + ',' + y] = b;
    doorCells[b.door.x + ',' + b.door.y] = b;
  });
  var signCells = {};
  SIGNS.forEach(function (s) { signCells[s.x + ',' + s.y] = s; });

  function ground(x, y) { return ROWS[y][x]; }

  window.GameMap = {
    W: W, H: H,
    buildings: BUILDINGS,
    signs: SIGNS,
    npcDefs: NPCS,

    solid: function (x, y) {
      if (x < 0 || y < 0 || x >= W || y >= H) return true;
      var g = ground(x, y);
      if (g === 'T' || g === 'W' || g === 'F') return true;
      if (buildingCells[x + ',' + y]) return true;
      if (signCells[x + ',' + y]) return true;
      return false;
    },

    doorAt: function (x, y) { return doorCells[x + ',' + y] || null; },
    signAt: function (x, y) { return signCells[x + ',' + y] || null; },
    buildingAt: function (x, y) { return buildingCells[x + ',' + y] || null; },

    /* g is a 2d context already translated to world space */
    draw: function (g, x0, y0, x1, y1, animFrame) {
      var t = Sprites.tiles, T = Sprites.TILE;
      var x, y, key;
      for (y = Math.max(0, y0); y <= Math.min(H - 1, y1); y++) {
        for (x = Math.max(0, x0); x <= Math.min(W - 1, x1); x++) {
          var ch = ground(x, y);
          var img;
          if (ch === '=') img = t.path;
          else if (ch === 'W') img = t.water[animFrame];
          else if (ch === ',') img = t.flower[animFrame];
          else if (ch === 'g') img = t.tallgrass[animFrame];
          else if (ch === 'T') img = t.tree;
          else if (ch === 'F') img = t.fence;
          else img = t.grass[(x * 7 + y * 13) % 3];
          g.drawImage(img, x * T, y * T);

          key = x + ',' + y;
          var b = buildingCells[key];
          if (b) {
            var roofRows = 2;
            if (y === b.y) {
              g.drawImage(Sprites.roof(b.roof).top, x * T, y * T);
            } else if (y < b.y + roofRows) {
              g.drawImage(Sprites.roof(b.roof).bottom, x * T, y * T);
            } else if (doorCells[key]) {
              g.drawImage(t.door, x * T, y * T);
            } else if (y === b.y + roofRows && (x === b.x + 1 || x === b.x + b.w - 2)) {
              g.drawImage(t.window, x * T, y * T);
            } else {
              g.drawImage(t.wall, x * T, y * T);
            }
          }
          if (signCells[key]) g.drawImage(t.sign, x * T, y * T);
        }
      }

      // roof plaques naming the resume section inside each building
      g.font = '8px "Press Start 2P", monospace';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      BUILDINGS.forEach(function (b) {
        var label = b.id.toUpperCase();
        var cx = (b.x + b.w / 2) * T;
        var py = b.y * T + 11;
        var w = g.measureText(label).width + 8;
        g.fillStyle = '#22232e';
        g.fillRect(cx - w / 2 - 1, py - 8, w + 2, 15);
        g.fillStyle = '#f8f4dc';
        g.fillRect(cx - w / 2, py - 7, w, 13);
        g.fillStyle = '#22232e';
        g.fillText(label, cx, py);
      });
    },
  };
})();
