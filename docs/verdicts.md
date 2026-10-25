# How Auspice decides

Every scan ends in one **verdict**, a **0–100 score** with a letter **grade**, and the evidence behind it.

| Verdict level | Meaning | Typical labels |
|---|---|---|
| `good` | clean contract and nothing structural against it | *Known asset*, *Looks strong* |
| `caution` | nothing fatal, nothing special | *Mixed*, *Weak* |
| `danger` | a trap or a structure that usually ends badly | *Rug risk*, *High risk*, *Avoid* |
| `info` | nothing to judge | *Not found* |

**Order of precedence.** Contract traps outrank everything: a live mint authority, a freeze authority, a honeypot or a
fee/hook trap is `danger` whatever the chart looks like. On the bonding curve the launch model leads. Once a coin has
graduated, market structure (liquidity, holders, flow) leads. Zero liquidity (under $500) is always *Avoid*.

**Score and grade.** 100 is the safest. The grade bands are A (best) to F.

**Known assets.** Major tokens are recognised by **mint address**, not by name, so a copycat called "BONK" is not treated
as Bonk. Issuer controls on a known asset (for example a stablecoin's freeze authority) are listed as notes, not penalised.

## The rug guard

The same holder rules A.U.G.U.R's snipers check before every buy:

| Rule | Limit |
|---|---|
| Top-10 wallets (excluding the pool) | ≤ 35% of supply |
| Bundle: supply still held by block-0 buyers | ≤ 20% |
| Tokens received without a buy (transfers, airdrops) | ≤ 10% |
| Insider networks | ≤ 15% |

A scan returns `rug_guard.ok` plus the exact `reasons` it failed on, for example `"top 10 holders own 74% (max 35%)"`.

## The probability model

See the [model card](model.md): what it predicts, how it was tested and where it is weak.

## Status flags

`facts` / `deep.flow` carry the live state: `LIVE`, the drop from peak (`from_peak_pct`) and **ALREADY DUMPED** when the
move has already happened. A low dump probability on a coin that already fell 80% is not a buy signal.
