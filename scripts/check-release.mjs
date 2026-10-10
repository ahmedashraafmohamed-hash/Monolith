#!/usr/bin/env node
// Release consistency check for the Monolith theme.
//
// Obsidian installs a theme from the GitHub release whose tag matches the version in
// manifest.json, and downloads manifest.json and theme.css from that release. This script
// checks that everything that describes a release agrees before you publish one:
//
//   manifest.json, versions.json, the git tag (when run on a tag), CHANGELOG.md,
//   the Style Settings block in theme.css, the README, the screenshot and the docs.
//
// Usage: node scripts/check-release.mjs [--tag <tag>]
// On GitHub Actions the tag is read from GITHUB_REF_NAME when the run was started by a tag.

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load as loadYaml } from 'js-yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SEMVER = /^\d+\.\d+\.\d+$/;
const errors = [];
let checks = 0;

const file = (p) => path.join(root, p);
const read = (p) => fs.readFileSync(file(p), 'utf8');
const exists = (p) => fs.existsSync(file(p));

function check(ok, message) {
  checks += 1;
  if (!ok) errors.push(message);
}

function readJson(p) {
  try {
    return JSON.parse(read(p));
  } catch (e) {
    check(false, `${p} is not readable JSON: ${e.message}`);
    return null;
  }
}

function compareVersions(a, b) {
  const x = a.split('.').map(Number);
  const y = b.split('.').map(Number);
  for (let i = 0; i < 3; i += 1) if (x[i] !== y[i]) return x[i] - y[i];
  return 0;
}

// 1. manifest.json ------------------------------------------------------------------------
const manifest = readJson('manifest.json');
if (manifest) {
  for (const key of ['name', 'version', 'minAppVersion', 'author']) {
    check(typeof manifest[key] === 'string' && manifest[key].trim() !== '', `manifest.json: "${key}" is missing or empty`);
  }
  check(SEMVER.test(manifest.version ?? ''), `manifest.json: version "${manifest.version}" must look like x.y.z`);
  check(SEMVER.test(manifest.minAppVersion ?? ''), `manifest.json: minAppVersion "${manifest.minAppVersion}" must look like x.y.z`);
}

// 2. versions.json ------------------------------------------------------------------------
const versions = readJson('versions.json');
if (manifest && versions) {
  const keys = Object.keys(versions);
  for (const k of keys) {
    check(SEMVER.test(k) && SEMVER.test(String(versions[k])), `versions.json: entry "${k}": "${versions[k]}" must be x.y.z: x.y.z`);
  }
  check(versions[manifest.version] === manifest.minAppVersion,
    `versions.json must contain "${manifest.version}": "${manifest.minAppVersion}" to match manifest.json (found ${JSON.stringify(versions[manifest.version])})`);
  const newer = keys.filter((k) => SEMVER.test(k) && compareVersions(k, manifest.version) > 0);
  check(newer.length === 0, `versions.json lists versions newer than manifest.json (${manifest.version}): ${newer.join(', ')}`);
}

// 3. Git tag (only when there is one) -----------------------------------------------------
let tag = null;
const tagArg = process.argv.indexOf('--tag');
if (tagArg !== -1) tag = process.argv[tagArg + 1];
else if (process.env.GITHUB_REF_TYPE === 'tag') tag = process.env.GITHUB_REF_NAME;
if (tag && manifest) {
  check(tag === manifest.version,
    `the tag "${tag}" must be exactly the manifest version "${manifest.version}" (no leading "v"). Obsidian looks for the release by that tag`);
}

// 4. theme.css ----------------------------------------------------------------------------
let css = '';
if (exists('theme.css')) {
  css = read('theme.css');
  check(css.trim().length > 0, 'theme.css is empty');
  check(!/@import\b/.test(css), 'theme.css uses @import. Community themes must not load remote assets');
  const urls = [...css.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)\s'"]*))\s*\)/g)].map((m) => m[1] ?? m[2] ?? m[3] ?? '');
  const remote = urls.filter((u) => !u.startsWith('data:'));
  check(remote.length === 0, `theme.css has url() values that are not data: URLs: ${remote.slice(0, 3).join(', ')}`);
} else {
  check(false, 'theme.css is missing');
}

// 5. Style Settings block, and the README that documents it ---------------------------------
const settingsMatch = css.match(/\/\*\s*@settings\s*\n([\s\S]*?)\*\//);
check(Boolean(settingsMatch), 'theme.css has no /* @settings ... */ block');
if (settingsMatch) {
  let doc = null;
  try {
    doc = loadYaml(settingsMatch[1]);
  } catch (e) {
    check(false, `the @settings block is not valid YAML: ${e.message}`);
  }
  if (doc) {
    check(doc.name === 'Monolith' && typeof doc.id === 'string', 'the @settings block needs name: Monolith and an id');
    const list = Array.isArray(doc.settings) ? doc.settings : [];
    check(list.length > 0, 'the @settings block has no settings');
    const readme = exists('README.md') ? read('README.md').toLowerCase() : '';
    const seen = new Set();
    for (const s of list) {
      check(s.id && s.title && s.type, `a setting is missing id, title or type: ${JSON.stringify(s)}`);
      check(!seen.has(s.id), `duplicate setting id "${s.id}"`);
      seen.add(s.id);
      check(readme.includes(String(s.title).toLowerCase()), `README.md does not mention the setting "${s.title}"`);
      if (s.type === 'variable-number-slider') {
        check(s.min <= s.default && s.default <= s.max && s.step > 0, `slider "${s.id}" needs min <= default <= max and a step above 0`);
        // The slider default must equal the value the stylesheet starts with.
        const m = css.match(new RegExp(`--${s.id}:\\s*([0-9.]+)`));
        if (m) check(Number(m[1]) === Number(s.default), `slider "${s.id}" defaults to ${s.default} but theme.css starts it at ${m[1]}`);
      }
    }
  }
}

// 6. Changelog ----------------------------------------------------------------------------
if (manifest) {
  const changelog = exists('CHANGELOG.md') ? read('CHANGELOG.md') : '';
  const heading = new RegExp(`^##\\s+\\[?${manifest.version.replace(/\./g, '\\.')}\\]?(\\s|$)`, 'm');
  check(heading.test(changelog), `CHANGELOG.md has no "## ${manifest.version}" section`);
}

// 7. Screenshot: the community listing recommends 512 x 288 ---------------------------------
const shot = 'screenshots/screenshot.png';
if (exists(shot)) {
  const buf = fs.readFileSync(file(shot));
  const isPng = buf.length > 24 && buf.subarray(1, 4).toString() === 'PNG';
  check(isPng, `${shot} is not a PNG`);
  if (isPng) {
    const w = buf.readUInt32BE(16);
    const h = buf.readUInt32BE(20);
    check(w === 512 && h === 288, `${shot} is ${w} x ${h}. The community listing recommends 512 x 288`);
  }
} else {
  check(false, `${shot} is missing`);
}

// 8. Docs and legal files ---------------------------------------------------------------------
check(exists('docs/design-notes.md'), 'docs/design-notes.md is missing');
if (exists('README.md')) check(read('README.md').includes('docs/design-notes.md'), 'README.md does not link to docs/design-notes.md');
if (exists('design-notes.md')) {
  const dup = read('design-notes.md');
  check(dup.split('\n').length <= 10 && dup.includes('docs/design-notes.md'),
    'design-notes.md in the repository root must only point to docs/design-notes.md, so the two copies cannot disagree');
}
for (const p of ['LICENSE', 'THIRD-PARTY-NOTICES.txt']) check(exists(p), `${p} is missing`);

// Report --------------------------------------------------------------------------------------
if (errors.length) {
  console.error(`Release check failed (${errors.length} of ${checks} checks):`);
  for (const e of errors) console.error(`  x ${e}`);
  process.exit(1);
}
console.log(`Release check passed (${checks} checks) for Monolith ${manifest.version}${tag ? `, tag ${tag}` : ''}.`);
console.log('Attach these two files, unchanged, to the GitHub release:');
for (const p of ['manifest.json', 'theme.css']) {
  const sha = crypto.createHash('sha256').update(fs.readFileSync(file(p))).digest('hex');
  console.log(`  ${p.padEnd(14)} sha256 ${sha}`);
}
