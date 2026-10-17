// node scan.mjs <address> [chain]: streams the engines live, then prints the verdict. Node 18+, no dependencies.
const [q = 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', chain] = process.argv.slice(2);
const url = `https://augur-trade.com/hub/api/v1/rugscope?stream=1&q=${encodeURIComponent(q)}` + (chain ? `&chain=${chain}` : '');

const res = await fetch(url);
let buf = '';
for await (const chunk of res.body) {
  buf += Buffer.from(chunk).toString();
  let i;
  while ((i = buf.indexOf('\n\n')) >= 0) {
    const block = buf.slice(0, i); buf = buf.slice(i + 2);
    const ev = (block.match(/^event: (.+)$/m) || [])[1], data = JSON.parse((block.match(/^data: (.+)$/m) || [])[1] || '{}');
    if (ev === 'start') console.log(`scanning ${data.q} on ${data.chain}: ${data.cores.length} engines`);
    if (ev === 'core') console.log(`  ✓ ${data.name.padEnd(12)} ${String(data.ms).padStart(5)} ms`);
    if (ev === 'error') { console.error('error:', data.error); process.exit(1); }
    if (ev === 'done') {
      const r = data.readout;
      console.log(`\n${r.symbol}: ${r.verdict.label} (${r.score}/100, grade ${r.grade}) — ${r.verdict.line}`);
      for (const c of r.checks.filter((c) => c.s !== 'ok')) console.log(`  ${c.s === 'bad' ? '✗' : '!'} ${c.t}`);
      if (r.deep && r.deep.model) console.log(`  dump in the next hour: ${r.deep.model.p_rug}% (90% range ${r.deep.model.lo}–${r.deep.model.hi}%)`);
    }
  }
}
