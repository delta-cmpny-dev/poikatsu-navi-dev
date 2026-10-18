const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'stages.js'), 'utf8');
const stages = JSON.parse(vm.runInNewContext(source + '\nJSON.stringify(STAGES)'));
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
test('every stage shows guide boxes from the start', () => {
  for (const s of stages) assert.equal(s.guide, true, s.id);
});
test('every scroll followed by a tap accepts a mid-scroll tap', () => {
  for (const st of stages) st.steps.forEach((s, i) => {
    if (s.type === 'scroll' && st.steps[i + 1]?.type === 'tap') assert.ok(s.target, st.id + ':' + i);
  });
});
test('Safari scroll targets match supplied frame coordinates', () => {
  const expected = [
    { from: 16, ys: [746,746,746,746,670,992,847,719,606,532,449,331,208,143,940,1101,1076,1036,1005,976,982,994,989,952,957] },
    { from: 20, ys: [697,697,697,441,263,191,349,341,329,323,321,319,260,276,160,1079,1024,822,571,1198,1073,956,768,615,513,453,411,362] },
    { from: 1, ys: [1084,1049,951,905,806,715,677,643,643,615,576,572,572] },
  ];
  assert.deepEqual(stages[0].steps.filter(s => s.type === 'scroll').map(s => s.target), expected);
});
test('Safari tracking warning is the short keep-once note', () => {
  assert.equal(stages[0].steps.find(s => s.after).warn, '一度設定すればキープされるので、毎回の確認は不要。');
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
      if (s.target) {
        assert.equal(stage.steps[i + 1]?.type, 'tap', label);
        assert.ok(Number.isInteger(s.target.from) && s.target.from >= 1 && s.target.from <= s.seq[1], label);
        assert.equal(s.target.ys.length, s.seq[1], label);
        for (const y of s.target.ys.slice(s.target.from - 1).filter(y => y != null)) {
          const [x, , w, h] = stage.steps[i + 1].rect;
          rect([x, y, w, h], label);
        }
      }
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
