#!/usr/bin/env node
/* =========================================================
   Regenerates resume.html and assets/Neev-Bhandari-Resume.pdf
   from js/data.js (the single source of truth).

   Usage:  node tools/generate.js

   The PDF is printed with headless Chrome; if Chrome is not
   found, the HTML files are still written and a warning shown.
   ========================================================= */
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const DATA = require(path.join(ROOT, 'js', 'data.js'));

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const WIP_STATUSES = { 'Work in Progress': 1, 'In Progress': 1 };
const statusClass = (status) => (WIP_STATUSES[status] ? 'wip' : 'done');

/* ---------- shared fragments ---------- */

const roleEntries = (compact) =>
  DATA.experience
    .map((emp) =>
      emp.roles
        .map((role) => {
          const where = emp.employer + (compact && emp.location.startsWith('Melbourne') && emp.employer !== 'ANZ' ? '' : ', ' + emp.location.split(',')[0]);
          const bullets = role.bullets.map((b) => `<li>${esc(b)}</li>`).join('\n        ');
          let sections = '';
          if (role.sections) {
            sections = role.sections
              .map(
                (sec) => compact
                  ? `<li><span class="sub">${esc(sec.heading.replace('Rotation: ', ''))} rotation:</span> ${esc(sec.bullets.join('; ').replace(/^([a-z])/, (m) => m))}</li>`
                  : `
      <div class="sub">
        <h4>${esc(sec.heading)}</h4>
        <ul>
          ${sec.bullets.map((b) => `<li>${esc(b)}</li>`).join('\n          ')}
        </ul>
      </div>`
              )
              .join('');
          }
          if (compact) {
            return `
  <div class="entry">
    <div class="head"><h3>${esc(role.title)} <span class="co">— ${esc(where)}</span></h3><span class="dates">${esc(role.dates)}</span></div>
    <ul>
        ${bullets}${role.sections ? '\n        ' + sections : ''}
    </ul>
  </div>`;
          }
          return `
    <div class="entry">
      <div class="entry-head">
        <h3>${esc(role.title)} <span class="where">— ${esc(where)}</span></h3>
        <span class="dates">${esc(role.dates)}</span>
      </div>
      <ul>
        ${bullets}
      </ul>${sections}
    </div>`;
        })
        .join('\n')
    )
    .join('\n');

const projectEntries = (compact) =>
  DATA.projects
    .map((p) => {
      const tech = p.types.join(' · ');
      const name = p.link ? (compact ? `${esc(p.name)} — ${esc(p.link.label)}` : `<a href="${esc(p.link.url)}" target="_blank" rel="noopener">${esc(p.name)}</a>`) : esc(p.name);
      const wip = p.status ? ` <span class="${statusClass(p.status)}">${esc(p.status)}</span>` : '';
      if (compact) {
        return `
  <div class="entry">
    <div class="head"><h3>${name}${wip} <span class="tech">${esc(tech)}</span></h3></div>
    <ul><li>${esc(p.description)}</li></ul>
  </div>`;
      }
      return `
    <div class="entry">
      <h3>${name}${wip} <span class="proj-tech">${esc(tech)}</span></h3>
      <ul><li>${esc(p.description)}</li></ul>
    </div>`;
    })
    .join('\n');

const skillRows = (tag) =>
  DATA.skills
    .map((s) => `<${tag === 'p' ? 'p' : 'p'}><b>${esc(s.shelf)}:</b> ${esc(s.items.join(', '))}</p>`)
    .join('\n      ');

const certLine = () =>
  DATA.certifications
    .map((c) => `${esc(c.name)} <span class="${statusClass(c.status)}">${esc(c.status)}</span>`)
    .join('<br>');

const educationEntries = (compact) =>
  DATA.education
    .map((ed) => {
      if (compact) {
        const detail = ed.details.length ? `<ul><li>${esc(ed.details.join('. ').replace(/\.\./g, '.'))}</li></ul>` : '';
        return `
  <div class="entry">
    <div class="head"><h3>${esc(ed.school)} <span class="co">— ${esc(ed.program)}</span></h3><span class="dates">${esc(ed.dates)}</span></div>
    ${detail}
  </div>`;
      }
      return `
    <div class="entry">
      <div class="entry-head">
        <h3>${esc(ed.school)} <span class="where">— ${esc(ed.location)}</span></h3>
        <span class="dates">${esc(ed.dates)}</span>
      </div>
      <p>${esc(ed.program)}</p>
      ${ed.details.map((d) => `<p class="where">${esc(d)}</p>`).join('\n      ')}
    </div>`;
    })
    .join('\n');

/* ---------- resume.html (plain fallback page) ---------- */

const plainHtml = () => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(DATA.name)} — Resume</title>
  <meta name="description" content="${esc(DATA.name)} — ${esc(DATA.title)}, ${esc(DATA.location)}.">
  <style>
    :root { --ink: #22232e; --muted: #5a5f6e; --accent: #d64545; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Georgia, 'Times New Roman', serif; background: #f4f1e4; color: var(--ink); line-height: 1.55; }
    .page { max-width: 780px; margin: 0 auto; padding: 32px 22px 60px; }
    .back-to-game { display: inline-block; font-family: 'Courier New', monospace; font-size: 13px; font-weight: bold; color: var(--ink); background: #fffdf2; border: 2px solid var(--ink); padding: 6px 10px; text-decoration: none; margin-bottom: 24px; }
    header.masthead h1 { margin: 0; font-size: 34px; letter-spacing: 1px; }
    .tagline { color: var(--muted); margin: 4px 0 10px; font-style: italic; }
    .contact-row { font-family: 'Courier New', monospace; font-size: 14px; }
    .contact-row a { color: var(--ink); }
    h2 { font-size: 15px; letter-spacing: 3px; text-transform: uppercase; border-bottom: 2px solid var(--ink); padding-bottom: 4px; margin: 34px 0 14px; }
    .entry { margin-bottom: 18px; }
    .entry-head { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 2px 12px; }
    .entry-head h3, .entry h3 { margin: 0; font-size: 17px; }
    .where { color: var(--muted); font-size: 14px; font-weight: normal; }
    .dates { font-family: 'Courier New', monospace; font-size: 13px; color: var(--muted); white-space: nowrap; }
    ul { margin: 6px 0 0; padding-left: 20px; }
    li { margin-bottom: 5px; }
    .sub { margin-top: 8px; }
    .sub h4 { margin: 0 0 2px; font-size: 14px; color: var(--muted); font-style: italic; font-weight: normal; }
    .skills-table p { margin: 0 0 4px; font-size: 15px; }
    .skills-table b { display: inline-block; min-width: 160px; }
    .wip, .done { font-family: 'Courier New', monospace; font-size: 12px; color: #fff; padding: 1px 6px; border-radius: 2px; vertical-align: 1px; }
    .wip { background: var(--accent); }
    .done { background: #3f9e5c; }
    .proj-tech { font-family: 'Courier New', monospace; font-size: 13px; color: var(--muted); font-weight: normal; }
    @media print {
      body { background: #fff; }
      .back-to-game, .foot-links { display: none; }
      .page { padding: 0; max-width: none; }
      h2 { margin-top: 20px; }
    }
  </style>
</head>
<body>
  <div class="page">
    <a class="back-to-game" href="index.html">&#9664; Back to the game version</a>

    <header class="masthead">
      <h1>${esc(DATA.name)}</h1>
      <p class="tagline">${esc(DATA.title)} — ${esc(DATA.location)}</p>
      <p class="contact-row">
        <a href="mailto:${esc(DATA.contact.email)}">${esc(DATA.contact.email)}</a> &middot;
        <a href="${esc(DATA.contact.github.url)}" target="_blank" rel="noopener">${esc(DATA.contact.github.label)}</a> &middot;
        <a href="${esc(DATA.contact.linkedin.url)}" target="_blank" rel="noopener">${esc(DATA.contact.linkedin.label)}</a> &middot;
        <a href="${esc(DATA.contact.pdf)}" download>Download PDF</a>
      </p>
    </header>

    <h2>Experience</h2>
${roleEntries(false)}

    <h2>Projects</h2>
${projectEntries(false)}

    <h2>Education</h2>
${educationEntries(false)}

    <h2>Certifications</h2>
    <p>${certLine()}</p>

    <h2>Skills</h2>
    <div class="skills-table">
      ${skillRows('p')}
    </div>

    <p class="foot-links"><a class="back-to-game" href="index.html">&#9664; Prefer to earn this information by walking around a tiny town? Play the game.</a></p>
  </div>
</body>
</html>
`;

/* ---------- print HTML (one-page PDF source) ---------- */

const printHtml = () => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${esc(DATA.name)} — Resume</title>
<style>
  @page { size: A4; margin: 9mm 12mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 8.6pt; line-height: 1.25; color: #1a1a1a; }
  h1 { font-size: 17pt; letter-spacing: .5px; }
  .tagline { font-size: 9pt; color: #444; margin: 1px 0 2px; }
  .contact { font-size: 8.3pt; color: #333; margin-bottom: 4px; }
  .contact a { color: #333; text-decoration: none; }
  h2 { font-size: 9pt; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid #1a1a1a; margin: 6px 0 3px; padding-bottom: 1px; }
  .entry { margin-bottom: 3.5px; }
  .head { display: flex; justify-content: space-between; align-items: baseline; }
  .head h3 { font-size: 9.5pt; }
  .head .co { font-weight: normal; color: #444; }
  .dates { font-size: 8.5pt; color: #555; white-space: nowrap; }
  ul { padding-left: 13px; margin: 1px 0 0; }
  li { margin-bottom: 1.5px; }
  .sub { font-style: italic; color: #444; font-size: 8.7pt; }
  .tech { font-weight: normal; font-size: 8.3pt; color: #555; }
  .skills p { margin-bottom: 1.5px; }
  .skills b { display: inline-block; min-width: 105px; }
  .wip, .done { font-size: 7.5pt; border: 1px solid #999; padding: 0 3px; color: #555; vertical-align: 1px; font-weight: normal; }
</style>
</head>
<body>
  <h1>${esc(DATA.name)}</h1>
  <p class="tagline">${esc(DATA.title)} — ${esc(DATA.location)}</p>
  <p class="contact"><a href="mailto:${esc(DATA.contact.email)}">${esc(DATA.contact.email)}</a> &nbsp;·&nbsp; <a href="${esc(DATA.contact.github.url)}">${esc(DATA.contact.github.label)}</a> &nbsp;·&nbsp; <a href="${esc(DATA.contact.linkedin.url)}">${esc(DATA.contact.linkedin.label)}</a></p>

  <h2>Experience</h2>
${roleEntries(true)}

  <h2>Projects</h2>
${projectEntries(true)}

  <h2>Education</h2>
${educationEntries(true)}

  <h2>Certifications</h2>
  <p>${certLine()}</p>

  <h2>Skills</h2>
  <div class="skills">
      ${skillRows('p')}
  </div>
</body>
</html>
`;

/* ---------- write files & print PDF ---------- */

const resumePath = path.join(ROOT, 'resume.html');
const printPath = path.join(__dirname, 'resume-print.html');
const pdfPath = path.join(ROOT, 'assets', 'Neev-Bhandari-Resume.pdf');

fs.writeFileSync(resumePath, plainHtml());
console.log('wrote', path.relative(ROOT, resumePath));
fs.writeFileSync(printPath, printHtml());
console.log('wrote', path.relative(ROOT, printPath));

const CHROME_CANDIDATES = [
  process.env.CHROME_BIN,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
].filter(Boolean);

const chrome = CHROME_CANDIDATES.find((p) => fs.existsSync(p));
if (!chrome) {
  console.warn('! Chrome not found — skipped PDF. Set CHROME_BIN and re-run.');
  process.exit(0);
}

fs.mkdirSync(path.dirname(pdfPath), { recursive: true });
execFileSync(chrome, [
  '--headless',
  '--disable-gpu',
  '--no-pdf-header-footer',
  `--print-to-pdf=${pdfPath}`,
  `file://${printPath}`,
]);
console.log('wrote', path.relative(ROOT, pdfPath));
console.log('\nDone. Reminder: the PDF should stay ONE page — open it and check after big edits.');
