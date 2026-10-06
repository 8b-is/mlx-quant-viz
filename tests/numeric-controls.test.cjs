const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const ctx = vm.createContext({});
vm.runInContext(html.slice(html.indexOf('function ternaryQuantize'), html.indexOf('// Seed hash cached')), ctx);
vm.runInContext(html.slice(html.indexOf('function drawBinView'), html.indexOf('function drawRecursion')), ctx);
test('all reachable dimensions and groups have complete scales and positive codes', () => {
  for(let dim = 64; dim <= 1024; dim += 64) for (const group of [32,64,128]) {
    const q = ctx.ternaryQuantize(new Float32Array(dim*dim).fill(1),group);
    assert.equal(q.scales.length, dim*dim/group);
    assert.ok(q.scales.every(s => s === 1));
    assert.ok(q.codes.every(c => c === 2));
  }
});
test('invalid shape, unsupported group and nonfinite inputs rejected', () => {
  for (const [w,g] of [[new Float32Array(4096),96],[new Float32Array(33),32],[new Float32Array(0),32],[new Float32Array(32).fill(NaN),32],[new Float32Array(32).fill(Infinity),32]]) {
    assert.throws(()=>ctx.ternaryQuantize(w,g), {name:'RangeError'});
  }
});
test('packed words preserve unsigned codes including the highest two bits', () => {
  for (const codes of [Array(32).fill(0),Array(32).fill(1),Array(32).fill(2),Array.from({length:32},(_,i)=>i%3)]) {
    const output = {};ctx.groupSize=32;ctx.quantized=Int8Array.from(codes);ctx.scales=new Float32Array([1]);ctx.document={getElementById:()=>output};
    ctx.drawBinView(0);
    const words=[...output.textContent.matchAll(/word\[\d+\]: 0x([0-9a-f]{8})/g)].map(m=>parseInt(m[1],16));
    assert.equal(words.length,2);
    assert.deepEqual(words.flatMap(w=>Array.from({length:16},(_,j)=>(w>>>(2*j))&3)),codes);
  }
});
test('control offers exactly the documented groups and valid default', () => {
 const select=html.match(/<select id="gs-slider">(.*?)<\/select>/s);
 assert.ok(select);assert.deepEqual([...select[1].matchAll(/value="(\d+)"/g)].map(m=>Number(m[1])),[32,64,128]);
 assert.match(select[1],/value="64" selected/);
});
