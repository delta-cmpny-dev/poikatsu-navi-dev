const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'stages.js'), 'utf8');
const stages = vm.runInNewContext(source + '\nJSON.parse(JSON.stringify(STAGES))');
let checks = 0;
function test(name, fn) {
  try { fn(); checks++; console.log('PASS ' + name); }
  catch (e) { console.error('FAIL ' + name + '\n' + e.stack); process.exitCode = 1; }
}
const order = ['safari', 'prep', 'sites', 'points', 'passbook', 'offer', 'inquiry', 'trouble', 'fx', 'bank'];
test('unique IDs and requested order', () => {
  assert.equal(new Set(stages.map(s => s.id)).size, stages.length);
  assert.equal(JSON.stringify(stages.map(s => s.id)), JSON.stringify(order));
});
test('existing safari and bank definitions remain unchanged', () => {
  const hashes = { safari: '690edb9b79d034b3ccc574f55e27e14a41397fe6c7522a7dbca4d8d586dfe68e', bank: 'e0ad340ab525c33039c2f14a5e5dfae08d83fbe442ac68dc22583a771130ded2' };
  for (const [id, hash] of Object.entries(hashes)) {
    assert.equal(crypto.createHash('sha256').update(JSON.stringify(stages.find(s => s.id === id))).digest('hex'), hash);
  }
});
function rect(r, label) {
  assert.ok(Array.isArray(r) && r.length === 4 && r.every(Number.isFinite), label);
  const [x, y, w, h] = r;
  assert.ok(x >= 0 && y >= 0 && w > 0 && h > 0 && x + w <= 590 && y + h <= 1280, label);
}
function overlap(a, b) {
  return a[0] < b[0] + b[2] && a[0] + a[2] > b[0] && a[1] < b[1] + b[3] && a[1] + a[3] > b[1];
}
for (const stage of stages) test(stage.id + ' data and assets', () => {
  assert.ok(stage.title && stage.lead && stage.steps.length);
  if (!['safari', 'bank'].includes(stage.id)) {
    assert.ok(stage.steps.length >= 8 && stage.steps.length <= 14);
    assert.equal(stage.steps[0].type, 'info');
    const warnings = stage.steps.filter(s => s.warn).length;
    assert.ok(warnings >= 2 && warnings <= 5);
  }
  for (const [i, s] of stage.steps.entries()) {
    const label = stage.id + ':' + (i + 1);
    assert.ok(['tap', 'scroll', 'quiz', 'info'].includes(s.type), label);
    assert.ok(s.text, label);
    if (s.type === 'tap') { rect(s.rect, label); assert.ok(s.img || s.html, label); }
    if (s.type === 'scroll') {
      assert.ok(Array.isArray(s.seq) && s.seq.length === 2 && typeof s.seq[0] === 'string', label);
      assert.ok(Number.isInteger(s.seq[1]) && s.seq[1] > 0, label);
    }
    if (s.type === 'quiz') {
      assert.ok(Array.isArray(s.choices) && s.choices.length >= 2, label);
      assert.equal(s.choices.filter(c => c.ok === true).length, 1, label);
      for (const c of s.choices) assert.ok(c.label && (c.ok || c.msg), label);
    }
    if (s.rect) rect(s.rect, label);
    for (const t of s.traps || []) {
      rect(t.rect, label); assert.ok(t.msg, label);
      assert.ok(!s.rect || !overlap(s.rect, t.rect), label + ' overlapping trap');
    }
    for (const name of [s.img, s.after].filter(Boolean)) assert.ok(fs.existsSync(path.join(root, 'img', name + '.jpg')), label + ' ' + name);
    if (s.seq) for (let k = 1; k <= s.seq[1]; k++) assert.ok(fs.existsSync(path.join(root, 'img', 'seq', s.seq[0] + '-' + String(k).padStart(2, '0') + '.jpg')), label);
    assert.ok(!s.link, label + ' link steps are replaced by in-app videos');
    if (s.video) { assert.equal(s.type, 'info', label); assert.ok(fs.existsSync(path.join(root, 'video', s.video + '.mp4')), label + ' ' + s.video); }
    if (s.html) { assert.equal(typeof s.html, 'string'); assert.ok(s.html.length); }
  }
});
test('new display types and video links are exercised', () => {
  const all = stages.flatMap(s => s.steps);
  assert.ok(all.some(s => s.type === 'info' && !s.img && !s.html));
  assert.ok(all.some(s => s.type === 'quiz' && !s.img && !s.html));
  const fx = stages.find(s => s.id === 'fx');
  assert.ok(fx && fx.steps.every(s => s.html && !s.img));
  assert.equal(all.filter(s => s.video).map(s => s.video).join(','), 'a8,inq-hapitas,inq-moppy');
});
console.log(checks + ' data checks passed');
