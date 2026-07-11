/* =========================================================
   NEEVVILLE — Menus & resume panels (DOM overlays)
   All content comes from window.DATA (js/data.js).
   ========================================================= */
(function () {
  'use strict';

  var panelEl, panelTitle, panelBody, menuEl;
  var listItems = [], selected = 0, detailRenderer = null;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------------- panel content builders ---------------- */

  function badgeIcon(badge, size) {
    return '<span class="badge-icon' + (size === 'lg' ? ' badge-lg' : '') + '" style="color:' + badge.color + '">' + badge.icon + '</span>';
  }

  function flatRoles() {
    var out = [];
    DATA.experience.forEach(function (emp) {
      emp.roles.forEach(function (role) { out.push({ emp: emp, role: role }); });
    });
    return out;
  }

  function buildExperience() {
    var roles = flatRoles();
    var badges = roles.map(function (r, i) {
      return '<button class="badge-slot" data-i="' + i + '" title="' + esc(r.role.badge.name) + '">' + badgeIcon(r.role.badge) + '</button>';
    }).join('');
    panelBody.innerHTML =
      '<div class="badge-case">' + badges + '</div>' +
      '<div class="split"><ul class="select-list" id="ui-list"></ul><div class="detail" id="ui-detail"></div></div>';

    var listEl = panelBody.querySelector('#ui-list');
    var html = '';
    var lastEmp = null;
    roles.forEach(function (r, i) {
      if (r.emp !== lastEmp) {
        html += '<li class="list-header">' + esc(r.emp.employer) + '</li>';
        lastEmp = r.emp;
      }
      html += '<li class="list-item" data-i="' + i + '">' + badgeIcon(r.role.badge) + ' ' + esc(r.role.title) + '</li>';
    });
    listEl.innerHTML = html;

    detailRenderer = function (i) {
      var r = roles[i];
      var out =
        '<div class="detail-head">' + badgeIcon(r.role.badge, 'lg') +
        '<div><h3>' + esc(r.role.title) + '</h3>' +
        '<p class="muted">' + esc(r.emp.employer) + ' · ' + esc(r.role.dates) + '</p>' +
        '<p class="badge-name" style="color:' + r.role.badge.color + '">' + esc(r.role.badge.name) + ' — EARNED</p></div></div>' +
        '<ul class="bullets">' + r.role.bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>';
      (r.role.sections || []).forEach(function (sec) {
        out += '<h4>' + esc(sec.heading) + '</h4>' +
          '<ul class="bullets">' + sec.bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>';
      });
      return out;
    };
    initList(roles.length);
  }

  function buildProjects() {
    panelBody.innerHTML = '<div class="split"><ul class="select-list" id="ui-list"></ul><div class="detail" id="ui-detail"></div></div>';
    var listEl = panelBody.querySelector('#ui-list');
    listEl.innerHTML = DATA.projects.map(function (p, i) {
      return '<li class="list-item" data-i="' + i + '"><span class="dex-no">No.' + p.no + '</span> ' + esc(p.name) + '</li>';
    }).join('');

    detailRenderer = function (i) {
      var p = DATA.projects[i];
      var out =
        '<div class="detail-head"><div>' +
        '<h3><span class="dex-no">No.' + p.no + '</span> ' + esc(p.name) + '</h3>' +
        '<p class="type-row">' + p.types.map(function (t) { return '<span class="type-chip">' + esc(t) + '</span>'; }).join('') +
        (p.status ? '<span class="type-chip ' + statusChipClass(p.status) + '">' + esc(p.status) + '</span>' : '') + '</p></div></div>' +
        '<p class="flavor">"' + esc(p.flavor) + '"</p>' +
        '<p>' + esc(p.description) + '</p>' +
        (p.link ? '<p><a href="' + esc(p.link.url) + '" target="_blank" rel="noopener">&#9654; ' + esc(p.link.label) + '</a></p>' : '');
      return out;
    };
    initList(DATA.projects.length);
  }

  function buildSkills() {
    panelBody.innerHTML = DATA.skills.map(function (shelf) {
      return '<h4 class="shelf-title">' + esc(shelf.shelf) + '</h4>' +
        '<div class="shelf">' + shelf.items.map(function (it) {
          return '<span class="item-slot">' + esc(it) + '</span>';
        }).join('') + '</div>';
    }).join('') +
      '<p class="muted small">The shopkeeper nods approvingly at your interest.</p>';
    detailRenderer = null;
  }

  function buildEducation() {
    var out = DATA.education.map(function (ed) {
      return '<div class="card"><h3>' + esc(ed.school) + '</h3>' +
        '<p class="muted">' + esc(ed.program) + '</p>' +
        '<p class="muted small">' + esc(ed.location) + ' · ' + esc(ed.dates) + '</p>' +
        ed.details.map(function (d) { return '<p class="small">' + esc(d) + '</p>'; }).join('') + '</div>';
    }).join('');
    out += '<h4 class="shelf-title">Certifications</h4>' +
      DATA.certifications.map(function (c) {
        return '<div class="card"><p>' + esc(c.name) + ' <span class="type-chip ' + statusChipClass(c.status) + '">' + esc(c.status) + '</span></p></div>';
      }).join('');
    panelBody.innerHTML = out;
    detailRenderer = null;
  }

  function buildContact() {
    var c = DATA.contact;
    panelBody.innerHTML =
      '<div class="card center-text">' +
      '<p>NURSE: "Welcome to the Wellness Center!<br>Shall I connect you to NEEV?"</p></div>' +
      '<div class="contact-links">' +
      '<a class="contact-link" href="mailto:' + esc(c.email) + '">&#9993; ' + esc(c.email) + '</a>' +
      '<a class="contact-link" href="' + esc(c.github.url) + '" target="_blank" rel="noopener">&#9670; ' + esc(c.github.label) + '</a>' +
      '<a class="contact-link" href="' + esc(c.linkedin.url) + '" target="_blank" rel="noopener">&#9670; ' + esc(c.linkedin.label) + '</a>' +
      '<a class="contact-link" href="' + esc(c.pdf) + '" download>&#8681; Download PDF resume</a>' +
      '<a class="contact-link" href="resume.html">&#9654; Plain text resume</a>' +
      '</div>';
    detailRenderer = null;
  }

  var WIP_STATUSES = { 'Work in Progress': 1, 'In Progress': 1 };
  function statusChipClass(status) {
    return WIP_STATUSES[status] ? 'chip-wip' : 'chip-done';
  }

  var PANELS = {
    experience: { title: 'CAREER GYM — Badges & Experience', build: buildExperience },
    projects: { title: 'RESEARCH LAB — ProjectDex', build: buildProjects },
    skills: { title: 'ITEM MART — Skills', build: buildSkills },
    education: { title: 'TRAINER SCHOOL — Education', build: buildEducation },
    contact: { title: 'WELLNESS CENTER — Contact', build: buildContact },
  };

  /* ---------------- list + detail plumbing ---------------- */

  function initList(count) {
    listItems = Array.prototype.slice.call(panelBody.querySelectorAll('.list-item'));
    selected = 0;
    listItems.forEach(function (el) {
      el.addEventListener('click', function () {
        select(parseInt(el.getAttribute('data-i'), 10));
      });
    });
    panelBody.querySelectorAll('.badge-slot').forEach(function (el) {
      el.addEventListener('click', function () {
        select(parseInt(el.getAttribute('data-i'), 10));
      });
    });
    select(0);
  }

  function select(i) {
    if (!detailRenderer) return;
    selected = i;
    listItems.forEach(function (el) {
      el.classList.toggle('selected', parseInt(el.getAttribute('data-i'), 10) === i);
    });
    var detail = panelBody.querySelector('#ui-detail');
    detail.innerHTML = detailRenderer(i);
    detail.scrollTop = 0;
    var sel = listItems.filter(function (el) { return parseInt(el.getAttribute('data-i'), 10) === i; })[0];
    if (sel && sel.scrollIntoView) sel.scrollIntoView({ block: 'nearest' });
  }

  /* ---------------- menu ---------------- */

  var MENU_ITEMS = [
    { label: 'BADGES', hint: 'Experience', action: function () { UI.openPanel('experience'); } },
    { label: 'PROJECTDEX', hint: 'Projects', action: function () { UI.openPanel('projects'); } },
    { label: 'BAG', hint: 'Skills', action: function () { UI.openPanel('skills'); } },
    { label: 'SCHOOL', hint: 'Education', action: function () { UI.openPanel('education'); } },
    { label: 'CONTACT', hint: 'Get in touch', action: function () { UI.openPanel('contact'); } },
    { label: 'PLAIN RESUME', hint: 'Skip the game', href: 'resume.html' },
    { label: 'SAVE AS PDF', hint: 'Download', href: null /* set in init from DATA */, download: true },
    { label: 'CLOSE', hint: '', action: function () { UI.closeMenu(); } },
  ];
  var menuIndex = 0;

  /* Render once per open; selection changes only touch the arrow spans.
     (Rebuilding innerHTML on hover would destroy the element mid-click.) */
  function renderMenu() {
    var list = menuEl.querySelector('.menu-list');
    list.innerHTML = MENU_ITEMS.map(function (m, i) {
      var inner = '<span class="menu-arrow">&nbsp;</span>' +
        m.label + (m.hint ? '<span class="menu-hint">' + m.hint + '</span>' : '');
      if (m.href) {
        return '<li><a href="' + m.href + '"' + (m.download ? ' download' : '') + ' data-i="' + i + '">' + inner + '</a></li>';
      }
      return '<li><button type="button" data-i="' + i + '">' + inner + '</button></li>';
    }).join('');
    list.querySelectorAll('[data-i]').forEach(function (el) {
      var i = parseInt(el.getAttribute('data-i'), 10);
      el.addEventListener('mouseenter', function () { setMenuIndex(i); });
      if (el.tagName === 'BUTTON') {
        el.addEventListener('click', function () {
          setMenuIndex(i);
          activateMenuItem();
        });
      }
    });
    setMenuIndex(menuIndex);
  }

  function setMenuIndex(i) {
    menuIndex = i;
    menuEl.querySelectorAll('[data-i]').forEach(function (el) {
      var arrow = el.querySelector('.menu-arrow');
      if (arrow) arrow.innerHTML = parseInt(el.getAttribute('data-i'), 10) === i ? '&#9654;' : '&nbsp;';
    });
  }

  function activateMenuItem() {
    if (window.SFX) SFX.select();
    var m = MENU_ITEMS[menuIndex];
    if (m.href) {
      var a = menuEl.querySelector('a[data-i="' + menuIndex + '"]');
      if (a) a.click();
      return;
    }
    m.action();
  }

  /* ---------------- public API ---------------- */

  window.UI = {
    init: function () {
      panelEl = document.getElementById('panel');
      panelTitle = panelEl.querySelector('.panel-title-text');
      panelBody = panelEl.querySelector('.panel-body');
      menuEl = document.getElementById('menu');
      MENU_ITEMS[6].href = DATA.contact.pdf;
      panelEl.querySelector('.panel-close').addEventListener('click', function () { UI.closePanel(); });
      document.getElementById('menu-btn').addEventListener('click', function () { UI.toggleMenu(); });
    },

    isOpen: function () { return !panelEl.hidden || !menuEl.hidden; },
    panelOpen: function () { return !panelEl.hidden; },

    openPanel: function (id) {
      var def = PANELS[id];
      if (!def) return;
      menuEl.hidden = true;
      panelTitle.textContent = def.title;
      def.build();
      panelEl.hidden = false;
      panelEl.querySelector('.panel-frame').focus();
    },

    closePanel: function () { panelEl.hidden = true; detailRenderer = null; },

    toggleMenu: function () {
      if (!panelEl.hidden) { this.closePanel(); return; }
      menuEl.hidden = !menuEl.hidden;
      if (!menuEl.hidden) { menuIndex = 0; renderMenu(); }
    },
    closeMenu: function () { menuEl.hidden = true; },

    /* returns true if the key was consumed */
    handleKey: function (key) {
      if (!menuEl.hidden) {
        if (key === 'up') { setMenuIndex((menuIndex + MENU_ITEMS.length - 1) % MENU_ITEMS.length); }
        else if (key === 'down') { setMenuIndex((menuIndex + 1) % MENU_ITEMS.length); }
        else if (key === 'a') { activateMenuItem(); }
        else if (key === 'b' || key === 'menu') { this.closeMenu(); }
        return true;
      }
      if (!panelEl.hidden) {
        if (key === 'b' || key === 'menu') { this.closePanel(); }
        else if (detailRenderer && key === 'up') { select(Math.max(0, selected - 1)); }
        else if (detailRenderer && key === 'down') { select(Math.min(listItems.length - 1, selected + 1)); }
        return true;
      }
      return false;
    },
  };
})();
