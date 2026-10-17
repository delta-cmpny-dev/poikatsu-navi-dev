// DOMを最小限再現し、本体のイベント処理を外部パッケージなしで検査する。
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const page = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const nodes = new Map();
function node(id) {
  if (nodes.has(id)) return nodes.get(id);
  const n = { id, style: {}, dataset: {}, innerHTML: '', textContent: '', className: '', hidden: false, clientHeight: 640,
    events: {}, addEventListener(type, fn) { this.events[type] = fn; },
    removeAttribute(name) { delete this[name]; }, setAttribute(name, value) { this[name] = value; },
    getBoundingClientRect() { return { left: 0, top: 0, width: 295, height: 640 }; },
    closest(selector) { return selector === '#card' && id === 'card' ? this : null; },
  };
  n.classList = {
    contains(c) { return n.className.split(' ').includes(c); },
    add(c) { if (!this.contains(c)) n.className += ' ' + c; },
    remove(c) { n.className = n.className.split(' ').filter(x => x !== c).join(' '); },
    toggle(c, on) { on ? this.add(c) : this.remove(c); },
  };
  nodes.set(id, n); return n;
}
const timers = new Map(), images = [], saved = new Map(); let timerId = 0;
const ctx = vm.createContext({
  document: { getElementById: node, querySelectorAll: () => ['home', 'play', 'clear'].map(node) },
  window: { scrollTo() {}, addEventListener() {} }, navigator: {},
  localStorage: { getItem: k => saved.get(k), setItem: (k, v) => saved.set(k, v) },
  Image: class { set src(value) { images.push(value); } },
  ResizeObserver: class { observe() {} },
  setTimeout: fn => { timers.set(++timerId, fn); return timerId; }, clearTimeout: id => timers.delete(id),
});
vm.runInContext(fs.readFileSync(path.join(root, 'stages.js'), 'utf8'), ctx);
vm.runInContext(page.match(/<script>([\s\S]*?)<\/script>/)[1], ctx);
const run = code => vm.runInContext(code, ctx);
function flush() { const callbacks = [...timers.values()]; timers.clear(); callbacks.forEach(fn => fn()); }
function clickCard(dataset) { node('card').events.click({ target: { dataset, classList: { add() {} } } }); }
function tap(r) {
  const e = { clientX: (r[0] + r[2] / 2) / 2, clientY: (r[1] + r[3] / 2) / 2, target: node('shot') };
  node('shot').events.pointerdown(e); node('shot').events.pointerup(e);
}
assert.match(node('stages').innerHTML, /stage-number/);
const count = run('STAGES.length');
for (let i = 0; i < count; i++) {
  run(`start(${i})`);
  const steps = run('stage.steps');
  for (let k = 0; k < steps.length; k++) {
    const s = steps[k];
    assert.equal(run('si'), k);
    if (!s.img && !s.html) {
      assert.ok(node('img').hidden);
      assert.equal(node('card').className, 'mid');
      assert.ok(node('shot').classList.contains('plain'));
    }
    if (s.type === 'info' || s.type === 'quiz') assert.equal(node('shot').style.touchAction, 'pan-y');
    if (s.html) { assert.equal(node('scene').innerHTML, s.html); assert.ok(!node('scene').hidden); }
    else assert.equal(node('scene').innerHTML, '');
    if (s.video) {
      assert.match(node('card').innerHTML, /data-video/);
      clickCard({ video: '' }); assert.equal(run('si'), k);
      assert.ok(node('player').classList.contains('on'));
      assert.match(node('video').src, new RegExp('video/' + s.video + '\.mp4$'));
      node('playerClose').onclick(); assert.ok(!node('player').classList.contains('on'));
    }
    if (s.type === 'info') clickCard({ next: '' });
    if (s.type === 'quiz') {
      const wrong = s.choices.findIndex(c => !c.ok);
      clickCard({ c: String(wrong) }); assert.equal(run('si'), k);
      clickCard({ c: String(s.choices.findIndex(c => c.ok)) });
    }
    if (s.type === 'tap') {
      if (s.traps?.length) { tap(s.traps[0].rect); assert.equal(node('toast').textContent, s.traps[0].msg); assert.equal(run('si'), k); }
      tap(s.rect);
    }
    if (s.type === 'scroll') { run('scrollBy(100000)'); assert.match(node('img').src, /seq\//); }
    flush();
    if (s.warn) { assert.ok(node('modal').classList.contains('on')); assert.equal(node('modalText').textContent, s.warn); node('modalOk').onclick(); }
  }
  assert.ok(node('clear').classList.contains('on'));
  for (const s of steps.filter(s => s.warn)) assert.ok(node('review').innerHTML.includes(s.warn));
  console.log('PASS full playthrough ' + run('stage.id'));
}
assert.ok(images.every(src => !src.includes('undefined')));
// タップ成功の待機中にやめて再開しても、前のタイマーが次のゲームを進めない。
run('start(0); si = 1; step()'); tap(run('stage.steps[si].rect'));
node('quit').onclick(); run('start(0)'); flush(); assert.equal(run('si'), 0);
console.log('PASS display modes, links, warnings, existing scrolls, and quit/restart');
