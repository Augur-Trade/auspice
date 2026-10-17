// A pre-trade gate for a trading bot: returns true only for tokens that pass. Node 18+.
//   import { passes } from './pre-trade-gate.mjs';  if (await passes(mint)) buy(mint);
export async function passes(q, { minScore = 60, maxDumpOdds = 30, chain } = {}) {
  const url = `https://augur-trade.com/hub/api/v1/rugscope?q=${encodeURIComponent(q)}` + (chain ? `&chain=${chain}` : '');
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) return false;                                   // fail closed: no scan, no buy
  const { readout: r } = await res.json();
  if (r.verdict.level === 'danger') return false;              // contract traps and dangerous structure
  if (r.rug_guard && r.rug_guard.ok === false) return false;   // holder rules (top-10, bundle, transfers, insiders)
  if ((r.score ?? 0) < minScore) return false;
  const m = r.deep && r.deep.model;
  if (m && m.p_rug > maxDumpOdds) return false;                // on the curve: likely to dump within the hour
  const peak = r.deep && r.deep.flow && r.deep.flow.from_peak_pct;
  if (peak != null && peak < -60) return false;                // already dumped: don't catch the knife
  return true;
}

if (process.argv[2]) console.log(process.argv[2], (await passes(process.argv[2])) ? 'PASS' : 'SKIP');
