# Scan API

One free endpoint, the same one the [Auspice site](https://augur-trade.com/rug/) uses. No key, no signup, CORS open.

```
GET https://augur-trade.com/hub/api/v1/rugscope?q=<token address>[&chain=<evm chain>][&stream=1]
```

| Parameter | | |
|---|---|---|
| `q` | required | A Solana mint, or a `0x…` contract. A Dexscreener or block-explorer link also works (the chain is read from the link). |
| `chain` | EVM only | One of `robinhood`, `base`, `ethereum`, `bsc`, `arbitrum`, `polygon`, `optimism`, `avalanche`, `linea`, `sonic`, `unichain`, `berachain`, `hyperevm`. Auto-detected when omitted. |
| `stream` | optional | `1` returns `text/event-stream` and reports each engine as it finishes |

**Limits:** 20 scans a minute and 400 a day per IP, 8 scans in flight across the service. Results are cached for 90 seconds (`"cached": true`).

## JSON response

```json
{ "ok": true, "ms": 1259, "cores": [ { "name": "contract", "ms": 163, "sum": { … } }, … ], "readout": { … } }
```

| `readout` field | |
|---|---|
| `verdict` | `{ level, label, line }`: level is `good` · `caution` · `danger` · `info` ([how it's decided](verdicts.md)) |
| `score`, `grade` | 0–100 (100 = safest) and A–F |
| `symbol`, `name`, `mint`, `on_curve` | the token; `on_curve` is true while a pump.fun coin is still on its bonding curve |
| `facts` | price, market cap, peak, liquidity, 24h volume, curve progress, graduation odds, buys and sells, age, token program |
| `checks` | the checklist: `{ s: "ok" \| "warn" \| "bad", t: "…" }` |
| `positives`, `risks` | plain-language reasons |
| `rug_guard` | `{ ok, reasons, warn, top10_pct, bundle, transfer_held_pct, rugcheck, holders }` |
| `top_holders` | largest wallets with share and labels |
| `deep` (Solana) | `jupiter`, `dexscreener`, `dev`, `flow`, `people`, `model`: the full output of the deep engines |
| `contract`, `bundle`, `chain` (EVM) | owner powers and levers, launch forensics, the chain |
| `links` | explorer, Dexscreener and swap links |

## Streaming

`stream=1` sends one `start`, one `core` per engine as it finishes, then `done` with the full readout (or `error`).

```text
event: start
data: {"q": "HhAja4gSP1KW9ceDFMKHDmNVX7VovCS8xtsu6LKtpump", "type": "solana", "chain": "solana", "cores": ["contract", "launch", "t22", "… 7 more"]}

event: core
data: {"name": "flow", "ms": 136, "sum": {"found": true, "creator": "9Db9WpH9cQ9bJj4uz2YJjG42G3Kt2XwV9bc5qhiuHQWG", "launched": 1792211446, "graduated": true, "trades": 594, "unique_buyers": 269, "step_s": 60, "timeline": [{"t": 1792211446, "buy": 83.655, "sell": 28.478, "n": 109, "c": 2.2538384828233501e-07, "h": 2.452299924528981e-07, "l": 2.797740284648689e-08}, {"t": 1792211506, "buy": 81.104, "sell": 74.292, "n": 155, "c": 2.628718417489983e-07, "h": 2.887910093552881e-07, "l": 2.2553112789920252e-07}, {"t": 1792211566, "buy": 73.711, "sell": 65.248, "n": 156, "c": 3.134674201590645e-07, "h": 3.447956973657741e-07, "l": 2.1942147217428328e-07}, "… 2 more"], "peak_mcap_usd": 43032, "mcap_usd": 43032, "from_peak_pct": 0, "last_trade": 1792211733, "features": {"mcap_sol": 410.88016963915686, "age": 287, "n10": 594, "buyers": 269, "sellers": 91, "flip": 91, "maxbuy": 13.034949036, "net": 85.00535948200007, "agent": 0, "top10": 74.1310900505348, "top1": 32.4821816613602, "devhold": 0.0353079674144, "devsold": false}}}

event: core
data: {"name": "launch", "ms": 136, "sum": {"score": 38, "verdict": "weak", "curve_pct": 100, "graduated": true, "dev": {"launches": 1, "graduated": 1, "holds_pct": 0.04, "sold_sol": 0}, "snipers": null, "odds_pct": 100}}

event: core
data: {"name": "jupiter", "ms": 162, "sum": {"found": true, "name": "Flying Matiz Roadster", "symbol": "FMR", "icon": "https://ipfs.io/ipfs/bafkreihnrchvdj56z25dwmf445rt5wdn2nkn6rt7pkc6lbplxxzdo2suly", "dev": "9Db9WpH9cQ9bJj4uz2YJjG42G3Kt2XwV9bc5qhiuHQWG", "launchpad": "pump.fun", "verified": false, "tags": ["unknown", "token-2022"], "holders": 453, "organic_score": 0, "organic_label": "low", "organic_volume_pct": 0, "volume_24h": 161297, "traders_24h": 480, "net_buyers_24h": 248, "buys_24h": 910, "sells_24h": 714, "price_change_24h": 259.7, "price_change_1h": 259.7, "holder_change_24h": 2564.7, "liquidity": 9632, "mcap": 68617, "price": 6.972865996984343e-05, "audit": {"mint_disabled": true, "freeze_disabled": true, "top_holders_pct": 14.2, "dev_balance_pct": 0, "dev_mints": 1, "dev_migrations": 1}, "created": "2026-10-17T04:30:46Z"}}

event: core
data: {"name": "dexscreener", "ms": 167, "sum": {"found": true, "pools": 1, "liquidity": 0, "volume_24h": 62475, "main": {"dex": "pumpfun", "pair": "DXP3M6fWneSK5TXsGnqfErmGjqMeZmhW485iGceY4Z17", "liq": null, "vol24": 62475.25, "tx5m": {"buys": 197, "sells": 126}, "tx1h": {"buys": 389, "sells": 205}, "tx24h": {"buys": 389, "sells": 205}, "chg": {"m5": 67.56, "h1": 1368, "h6": 1368, "h24": 1368}, "created": 1792211446000, "url": "https://dexscreener.com/solana/dxp3m6fwnesk5txsgnqfermgjqmezmhw485igcey4z17"}, "image": null, "socials": [], "websites": 0, "boosts": 0, "mcap": 42961.63, "first_pool": 1792211446000}}

event: core
data: {"name": "t22", "ms": 178, "sum": {"checks": []}}

event: core
data: {"name": "contract", "ms": 214, "sum": {"grade": "C", "symbol": "FMR", "name": "Flying Matiz Roadster", "mint_authority": false, "freeze_authority": false, "top10": null, "liquidity_usd": 19128.93, "flags": [{"s": "high", "t": "Pair is 0.0 hours old."}, {"s": "med", "t": "Top-pair liquidity under $25k ($19,129)."}, {"s": "low", "t": "No website or socials registered on DexScreener."}]}}

event: core
data: {"name": "devhist", "ms": 259, "sum": {"found": true, "creator": "9Db9WpH9cQ9bJj4uz2YJjG42G3Kt2XwV9bc5qhiuHQWG", "username": "dev_username", "followers": 1, "banned": false, "coin": {"ath_mcap": 77347, "mcap": 68075, "replies": null, "complete": true, "twitter": true, "telegram": false, "website": true, "created": 1792211446000}, "launches_seen": 1, "capped": false, "other_launches": 0, "launches_24h": 0, "launches_7d": 0, "graduated": 0, "graduation_rate_pct": null, "collapsed_pct": null, "median_ath": null, "median_now": null, "median_drawdown_pct": null, "best": null, "recent": []}}

event: core
data: {"name": "people", "ms": 271, "sum": {"callers": [], "callers_n": 0, "traders": [{"wallet": "HgLdow9ijrcDa12Xy6WK9TNbafHVeSCdyZZ4rgJagiDY", "name": "trader_1", "kind": "caller", "followers": 2, "bought_sol": 1.721, "sold_sol": 0}, {"wallet": "Cu6jZjxRT1Hbgs5bke6RCpScs3CKR3UdeYbCaUCN4G4A", "name": "trader_2", "kind": "caller", "followers": 21, "bought_sol": 1.69, "sold_sol": 0}, {"wallet": "YgzTN6ttYQSMeUjUqpoigGPAM1bqkXVKxLMgGrMGoWz", "name": "trader_3", "kind": "caller", "followers": 27, "bought_sol": 1.62, "sold_sol": 0}, "… 22 more"], "traders_n": 28, "top_pnl_n": 1, "top_pnl_net_sol": 0.717}}

event: core
data: {"name": "bundle", "ms": 416, "sum": {"ok": false, "reasons": ["block-0 buyers took 65% of supply (max 20%)"], "wallets": 6, "bots": 2, "dev_linked": 0, "b0_pct": 65.3, "top10": 14.2, "dev": {"launches24h": 0, "heldPct": 0.04, "sold": false}, "rugcheck": {"score": 1, "risks": []}}}

event: core
data: {"name": "model", "ms": 416, "sum": {"skipped": true, "why": "coin has graduated off the bonding curve; the model is trained on curve launches"}}

event: done
data: {"ms": 416, "readout": "{ … same as the JSON readout … }"}
```

## Errors

| Status | When |
|---|---|
| `400` | no `q`, or `q` is a wallet or a transaction instead of a token. The message says which |
| `429` | over 20 scans a minute or 400 a day |
| `503` | busy (8 scans in flight): retry in a few seconds |
| `502` | a data source failed |

In stream mode, errors arrive as an `error` event.

## Real responses

<details><summary><b>pump.fun coin on the bonding curve</b>: all 10 engines, with the model (verdict: Rug risk)</summary>

```json
{
 "ok": true,
 "cores": [
  {
   "name": "bundle",
   "ms": 32,
   "sum": {
    "ok": false,
    "reasons": [
     "top 10 wallets hold 74% (max 35%)",
     "block-0 buyers took 65% of supply (max 20%)"
    ],
    "wallets": 6,
    "bots": 2,
    "dev_linked": 0,
    "b0_pct": 65.3,
    "top10": 73.8,
    "dev": {
     "launches24h": 0,
     "heldPct": 0.04,
     "sold": false
    },
    "rugcheck": {
     "score": 1,
     "risks": []
    }
   }
  },
  {
   "name": "flow",
   "ms": 39,
   "sum": {
    "found": true,
    "creator": "9Db9WpH9cQ9bJj4uz2YJjG42G3Kt2XwV9bc5qhiuHQWG",
    "launched": 1792211446,
    "graduated": false,
    "trades": 437,
    "unique_buyers": 199,
    "step_s": 60,
    "timeline": [
     {
      "t": 1792211446,
      "buy": 83.655,
      "sell": 28.478,
      "n": 109,
      "c": 2.2538384828233501e-07,
      "h": 2.452299924528981e-07,
      "l": 2.797740284648689e-08
     },
     {
      "t": 1792211506,
      "buy": 81.104,
      "sell": 74.292,
      "n": 155,
      "c": 2.628718417489983e-07,
      "h": 2.887910093552881e-07,
      "l": 2.2553112789920252e-07
     },
     {
      "t": 1792211566,
      "buy": 73.711,
      "sell": 65.248,
      "n": 156,
      "c": 3.134674201590645e-07,
      "h": 3.447956973657741e-07,
      "l": 2.1942147217428328e-07
     },
     {
      "t": 1792211626,
      "buy": 7.822,
      "sell": 6.973,
      "n": 17,
      "c": 3.187884644954074e-07,
      "h": 3.363378041828831e-07,
      "l": 3.1144511122761655e-07
     }
    ],
    "peak_mcap_usd": 36051,
    "mcap_usd": 33332,
    "from_peak_pct": -7.5,
    "last_trade": 1792211634,
    "features": {
     "mcap_sol": 318.78846449540737,
     "age": 188,
     "n10": 437,
     "buyers": 199,
     "sellers": 49,
     "flip": 49,
     "maxbuy": 13.034949036,
     "net": 71.300546406,
     "agent": 0,
     "top10": 73.8119486873029,
     "top1": 32.4821816613602,
     "devhold": 0.0353079674144,
     "devsold": false
    }
   }
  },
  {
   "name": "launch",
   "ms": 40,
   "sum": {
    "score": 63,
    "verdict": "neutral",
    "curve_pct": 95.23,
    "graduated": false,
    "dev": {
     "launches": 1,
     "graduated": 0,
     "holds_pct": 0.04,
     "sold_sol": 0
    },
    "snipers": null,
    "odds_pct": 9.72
   }
  },
  {
   "name": "contract",
   "ms": 42,
   "sum": {
    "grade": "F",
    "symbol": "FMR",
    "name": "Flying Matiz Roadster",
    "mint_authority": false,
    "freeze_authority": false,
    "top10": null,
    "liquidity_usd": 0,
    "flags": [
     {
      "s": "high",
      "t": "Top-pair liquidity under $5k ($0) - exit slippage will be brutal."
     },
     {
      "s": "high",
      "t": "Pair is 0.1 hours old."
     },
     {
      "s": "med",
      "t": "Still on the pump.fun bonding curve (91% sold, 62.079 SOL in it) - not yet on a DEX."
     },
     {
      "s": "low",
      "t": "Only one Solana pair - single point of liquidity failure."
     },
     {
      "s": "low",
      "t": "No website or socials registered on DexScreener."
     }
    ]
   }
  },
  {
   "name": "jupiter",
   "ms": 47,
   "sum": {
    "found": true,
    "name": "Flying Matiz Roadster",
    "symbol": "FMR",
    "icon": null,
    "dev": "9Db9WpH9cQ9bJj4uz2YJjG42G3Kt2XwV9bc5qhiuHQWG",
    "launchpad": "pump.fun",
    "verified": false,
    "tags": [
     "unknown",
     "token-2022"
    ],
    "holders": 360,
    "organic_score": 0,
    "organic_label": "low",
    "organic_volume_pct": 0,
    "volume_24h": 43988,
    "traders_24h": 190,
    "net_buyers_24h": 153,
    "buys_24h": 288,
    "sells_24h": 145,
    "price_change_24h": 72,
    "price_change_1h": 72,
    "holder_change_24h": 2017.6,
    "liquidity": 10594,
    "mcap": 33339,
    "price": 3.333852654582248e-05,
    "audit": {
     "mint_disabled": true,
     "freeze_disabled": true,
     "top_holders_pct": 19.4,
     "dev_balance_pct": 0,
     "dev_mints": 1,
     "dev_migrations": null
    },
    "created": "2026-10-17T04:30:46Z"
   }
  },
  "… 5 more"
 ],
 "readout": {
  "rug_guard": {
   "ok": false,
   "reasons": [
    "top 10 wallets hold 74% (max 35%)",
    "block-0 buyers took 65% of supply (max 20%)"
   ],
   "warn": [],
   "dev": {
    "wallet": "9Db9WpH9cQ9bJj4uz2YJjG42G3Kt2XwV9bc5qhiuHQWG",
    "launches24h": 0,
    "launches7d": 0,
    "sold": false,
    "boughtPct": 0.04,
    "heldPct": 0.04,
    "graduated": false,
    "age": 190
   },
   "top10_pct": 73.8,
   "bundle": {
    "wallets": 6,
    "bots": 2,
    "dev_linked": 0,
    "bought_pct": 65.3,
    "still_held_pct": 64.7,
    "list": [
     {
      "wallet": "7M4GWNuSN4LHBKSnWBf692FwJg58Uk9Q5dc2MhJxVBRa",
      "boughtPct": 32.48,
      "sol": 13.035,
      "heldPct": 32.48,
      "launches7d": 0,
      "devLinked": 0,
      "kind": "bundle"
     },
     {
      "wallet": "Hhi9uxYDRYg7hnLfwhXsYa4snck7hMXVrnRZ9eEG5sec",
      "boughtPct": 15.67,
      "sol": 11.411,
      "heldPct": 15.67,
      "launches7d": 0,
      "devLinked": 0,
      "kind": "bundle"
     },
     {
      "wallet": "3yjTBDgZ3THs45JeyLM5MHfJDfFqwdAub97Gj7oXvBVC",
      "boughtPct": 9.43,
      "sol": 10.341,
      "heldPct": 9.43,
      "launches7d": 0,
      "devLinked": 0,
      "kind": "bundle"
     },
     {
      "wallet": "G1vyBwXUDkNbHpdxsFYTRAnYyF6RtjMtxo9PEuXkGgrd",
      "boughtPct": 7.16,
      "sol": 10.913,
      "heldPct": 7.16,
      "launches7d": 0,
      "devLinked": 0,
      "kind": "bundle"
     },
     {
      "wallet": "HxcdEi6CWzQtPCmM8E2maEZ3oYVGZxESqCWU1iPzmhVW",
      "boughtPct": 0.4,
      "sol": 0.717,
      "heldPct": 0.4,
      "launches7d": 1601,
      "devLinked": 0,
      "kind": "sniper bot"
     },
     "… 1 more"
    ]
   },
   "transfer_held_pct": 0,
   "rugcheck_score": 1,
   "rugcheck": {
    "score": 1,
    "risks": [],
    "insiderNetworks": 0,
    "insiderPct": 0,
    "transferHolderPct": 0,
    "transferHolders": [],
    "creatorTokens": 0,
    "top10": 23.7
   },
   "holders": {
    "top10": 73.8,
    "top": [
     {
      "wallet": "7M4GWNuSN4LHBKSnWBf692FwJg58Uk9Q5dc2MhJxVBRa",
      "pct": 32.48,
      "dev": false
     },
     {
      "wallet": "Hhi9uxYDRYg7hnLfwhXsYa4snck7hMXVrnRZ9eEG5sec",
      "pct": 15.67,
      "dev": false
     },
     {
      "wallet": "3yjTBDgZ3THs45JeyLM5MHfJDfFqwdAub97Gj7oXvBVC",
      "pct": 9.43,
      "dev": false
     },
     {
      "wallet": "G1vyBwXUDkNbHpdxsFYTRAnYyF6RtjMtxo9PEuXkGgrd",
      "pct": 7.16,
      "dev": false
     },
     {
      "wallet": "2AN7hr5WhSSXjfAh3eafarnXp2ZRrgoxV9kaH6zF2XZE",
      "pct": 1.88,
      "dev": false
     },
     "… 5 more"
    ],
    "source": "curve trades"
   }
  },
  "kind": "token",
  "mint": "HhAja4gSP1KW9ceDFMKHDmNVX7VovCS8xtsu6LKtpump",
  "symbol": "FMR",
  "name": "Flying Matiz Roadster",
  "verdict": {
   "level": "danger",
   "label": "Rug risk",
   "line": "Top 10 wallets hold 74% (max 35%)."
  },
  "score": 35,
  "grade": "F",
  "on_curve": true,
  "facts": {
   "price_usd": 2.64e-05,
   "mcap_usd": 33333,
   "peak_mcap_usd": 36052,
   "liquidity_usd": null,
   "volume_24h_usd": 16147.32,
   "curve_pct": 95.23,
   "grad_odds_pct": 9.72,
   "grad_base_pct": 2.21,
   "wallets": 199,
   "net_sol": 71.3005,
   "buys": 292,
   "sells": 145,
   "age_h": 0.1,
   "program": "Token-2022"
  },
  "checks": [
   {
    "s": "ok",
    "t": "Mint authority revoked"
   },
   {
    "s": "ok",
    "t": "Freeze authority revoked"
   },
   {
    "s": "ok",
    "t": "No hidden transfer fees, hooks or delegates"
   },
   {
    "s": "ok",
    "t": "Dev holds 0.04%"
   },
   {
    "s": "bad",
    "t": "6 wallets sniped the launch, still holding 65.32%"
   },
   "… 2 more"
  ],
  "counts": {
   "bad": 3,
   "warn": 0
  },
  "positives": [
   "graduation odds 9.72% (4.41× the base rate)",
   "199 wallets, net +71.3005 SOL"
  ],
  "risks": [
   "6 wallets sniped the launch slots",
   "top holders own 73.8%"
  ],
  "top_holders": [
   {
    "wallet": "7M4GWNuSN4LHBKSnWBf692FwJg58Uk9Q5dc2MhJxVBRa",
    "pct": 32.48
   },
   {
    "wallet": "Hhi9uxYDRYg7hnLfwhXsYa4snck7hMXVrnRZ9eEG5sec",
    "pct": 15.67
   },
   {
    "wallet": "3yjTBDgZ3THs45JeyLM5MHfJDfFqwdAub97Gj7oXvBVC",
    "pct": 9.43
   },
   {
    "wallet": "G1vyBwXUDkNbHpdxsFYTRAnYyF6RtjMtxo9PEuXkGgrd",
    "pct": 7.16
   },
   {
    "wallet": "2AN7hr5WhSSXjfAh3eafarnXp2ZRrgoxV9kaH6zF2XZE",
    "pct": 1.88
   }
  ],
  "links": {
   "dexscreener": "https://dexscreener.com/solana/dxp3m6fwnesk5txsgnqfermgjqmezmhw485igcey4z17",
   "pumpfun": "https://pump.fun/coin/HhAja4gSP1KW9ceDFMKHDmNVX7VovCS8xtsu6LKtpump",
   "solscan": "https://solscan.io/token/HhAja4gSP1KW9ceDFMKHDmNVX7VovCS8xtsu6LKtpump"
  },
  "tools": [
   "token_risk",
   "launch_scan"
  ],
  "deep": {
   "jupiter": {
    "found": true,
    "name": "Flying Matiz Roadster",
    "symbol": "FMR",
    "icon": null,
    "dev": "9Db9WpH9cQ9bJj4uz2YJjG42G3Kt2XwV9bc5qhiuHQWG",
    "launchpad": "pump.fun",
    "verified": false,
    "tags": [
     "unknown",
     "token-2022"
    ],
    "holders": 360,
    "organic_score": 0,
    "organic_label": "low",
    "organic_volume_pct": 0,
    "volume_24h": 43988,
    "traders_24h": 190,
    "net_buyers_24h": 153,
    "buys_24h": 288,
    "sells_24h": 145,
    "price_change_24h": 72,
    "price_change_1h": 72,
    "holder_change_24h": 2017.6,
    "liquidity": 10594,
    "mcap": 33339,
    "price": 3.333852654582248e-05,
    "audit": {
     "mint_disabled": true,
     "freeze_disabled": true,
     "top_holders_pct": 19.4,
     "dev_balance_pct": 0,
     "dev_mints": 1,
     "dev_migrations": null
    },
    "created": "2026-10-17T04:30:46Z"
   },
   "dexscreener": {
    "found": true,
    "pools": 1,
    "liquidity": 0,
    "volume_24h": 34940,
    "main": {
     "dex": "pumpfun",
     "pair": "DXP3M6fWneSK5TXsGnqfErmGjqMeZmhW485iGceY4Z17",
     "liq": null,
     "vol24": 34939.54,
     "tx5m": {
      "buys": 240,
      "sells": 103
     },
     "tx1h": {
      "buys": 240,
      "sells": 103
     },
     "tx24h": {
      "buys": 240,
      "sells": 103
     },
     "chg": {
      "m5": 896,
      "h1": 896,
      "h6": 896,
      "h24": 896
     },
     "created": 1792211446000,
     "url": "https://dexscreener.com/solana/dxp3m6fwnesk5txsgnqfermgjqmezmhw485igcey4z17"
    },
    "image": null,
    "socials": [],
    "websites": 0,
    "boosts": 0,
    "mcap": 29143.99,
    "first_pool": 1792211446000
   },
   "dev": {
    "found": true,
    "creator": "9Db9WpH9cQ9bJj4uz2YJjG42G3Kt2XwV9bc5qhiuHQWG",
    "username": "dev_username",
    "followers": 1,
    "banned": false,
    "coin": {
     "ath_mcap": 36053,
     "mcap": 33335,
     "replies": null,
     "complete": false,
     "twitter": true,
     "telegram": false,
     "website": true,
     "created": 1792211446000
    },
    "launches_seen": 1,
    "capped": false,
    "other_launches": 0,
    "launches_24h": 0,
    "launches_7d": 0,
    "graduated": 0,
    "graduation_rate_pct": null,
    "collapsed_pct": null,
    "median_ath": null,
    "median_now": null,
    "median_drawdown_pct": null,
    "best": null,
    "recent": []
   },
   "flow": {
    "found": true,
    "creator": "9Db9WpH9cQ9bJj4uz2YJjG42G3Kt2XwV9bc5qhiuHQWG",
    "launched": 1792211446,
    "graduated": false,
    "trades": 437,
    "unique_buyers": 199,
    "step_s": 60,
    "timeline": [
     {
      "t": 1792211446,
      "buy": 83.655,
      "sell": 28.478,
      "n": 109,
      "c": 2.2538384828233501e-07,
      "h": 2.452299924528981e-07,
      "l": 2.797740284648689e-08
     },
     {
      "t": 1792211506,
      "buy": 81.104,
      "sell": 74.292,
      "n": 155,
      "c": 2.628718417489983e-07,
      "h": 2.887910093552881e-07,
      "l": 2.2553112789920252e-07
     },
     {
      "t": 1792211566,
      "buy": 73.711,
      "sell": 65.248,
      "n": 156,
      "c": 3.134674201590645e-07,
      "h": 3.447956973657741e-07,
      "l": 2.1942147217428328e-07
     },
     {
      "t": 1792211626,
      "buy": 7.822,
      "sell": 6.973,
      "n": 17,
      "c": 3.187884644954074e-07,
      "h": 3.363378041828831e-07,
      "l": 3.1144511122761655e-07
     }
    ],
    "peak_mcap_usd": 36051,
    "mcap_usd": 33332,
    "from_peak_pct": -7.5,
    "last_trade": 1792211634,
    "features": {
     "mcap_sol": 318.78846449540737,
     "age": 188,
     "n10": 437,
     "buyers": 199,
     "sellers": 49,
     "flip": 49,
     "maxbuy": 13.034949036,
     "net": 71.300546406,
     "agent": 0,
     "top10": 73.8119486873029,
     "top1": 32.4821816613602,
     "devhold": 0.0353079674144,
     "devsold": false
    }
   },
   "people": {
    "callers": [],
    "callers_n": 0,
    "traders": [
     {
      "wallet": "Cu6jZjxRT1Hbgs5bke6RCpScs3CKR3UdeYbCaUCN4G4A",
      "name": "trader_1",
      "kind": "caller",
      "followers": 21,
      "bought_sol": 1.69,
      "sold_sol": 0
     },
     {
      "wallet": "6xGNNBK9oGDEXSQxgCpdTntSVSvADVjHXkWJtQNviBV9",
      "name": "trader_2",
      "kind": "caller",
      "followers": 13,
      "bought_sol": 1.58,
      "sold_sol": 0
     },
     {
      "wallet": "4kgHfGxDMUFrVLkfMQZhrQeVDkVGDUnCJZyWrBWmpTqy",
      "name": "trader_3",
      "kind": "caller",
      "followers": 3,
      "bought_sol": 1.548,
      "sold_sol": 0
     },
     {
      "wallet": "H2guufqLEjoyDiiJxgm4JZwW5J74WcDtX3iJuZTMPUD6",
      "name": "trader_4",
      "kind": "caller",
      "followers": 17,
      "bought_sol": 1.525,
      "sold_sol": 0
     },
     {
      "wallet": "Ge7Ro1gbiEHHmp2h5Pa2UbumzNncRkZcVFBqKBPJmUWo",
      "name": "trader_5",
      "kind": "caller",
      "followers": 18,
      "bought_sol": 1.521,
      "sold_sol": 0
     },
     "… 14 more"
    ],
    "traders_n": 19,
    "top_pnl_n": 1,
    "top_pnl_net_sol": 0.717
   },
   "model": {
    "p_rug": 26.5,
    "lo": 12.7,
    "hi": 32.3,
    "base_rate": 19.4,
    "lift": 1.36,
    "contributions": [
     {
      "k": "net_total",
      "label": "net SOL since launch",
      "value": 4.281,
      "push": 0.943
     },
     {
      "k": "log_mcap_sol",
      "label": "market cap",
      "value": 5.765,
      "push": -0.498
     },
     {
      "k": "progress",
      "label": "bonding-curve progress",
      "value": 0.839,
      "push": -0.245
     },
     {
      "k": "top10",
      "label": "top-10 concentration",
      "value": 73.812,
      "push": 0.133
     },
     {
      "k": "b0_held",
      "label": "block-0 still held",
      "value": 65.323,
      "push": 0.115
     },
     "… 32 more"
    ],
    "outcome": "price falls 50% below the scan price within 60 min before ever rising 20%",
    "trained_on": 48857,
    "test_auc": 0.837,
    "calls_auc": 0.753,
    "logistic_auc": 0.774,
    "test_brier": 0.117,
    "test_brier_base": 0.1524,
    "version": "2026-10-10b",
    "kind": "gradient-boosted trees",
    "ensemble": 7
   }
  }
 },
 "ms": 209
}
```
</details>

<details><summary><b>Established token</b>: Bonk (verdict: Known asset)</summary>

```json
{
 "ok": true,
 "cores": [
  {
   "name": "launch",
   "ms": 80,
   "sum": {
    "skipped": true
   }
  },
  {
   "name": "flow",
   "ms": 80,
   "sum": {
    "found": false
   }
  },
  {
   "name": "dexscreener",
   "ms": 110,
   "sum": {
    "found": true,
    "pools": 1,
    "liquidity": 314284,
    "volume_24h": 130026,
    "main": {
     "dex": "orca",
     "pair": "5zpyutJu9ee6jFymDGoK7F6S5Kczqtc9FomP3ueKuyA9",
     "liq": 314283.86,
     "vol24": 130025.59,
     "tx5m": {
      "buys": 5,
      "sells": 0
     },
     "tx1h": {
      "buys": 83,
      "sells": 54
     },
     "tx24h": {
      "buys": 2852,
      "sells": 3393
     },
     "chg": {
      "m5": 0.08,
      "h1": 0.07,
      "h6": 0.52,
      "h24": -0.94
     },
     "created": 1671980424000,
     "url": "https://dexscreener.com/solana/5zpyutju9ee6jfymdgok7f6s5kczqtc9fomp3uekuya9"
    },
    "image": "https://cdn.dexscreener.com/cms/images/ba03c0370670d176dc33bbd212eb023337a460ad7edfa053ca96ae22f31c3dcf?width=800&height=800&quality=95&format=auto",
    "socials": [
     "twitter",
     "telegram",
     "discord"
    ],
    "websites": 1,
    "boosts": 0,
    "mcap": 269258866,
    "first_pool": 1671980424000
   }
  },
  {
   "name": "t22",
   "ms": 128,
   "sum": {
    "checks": []
   }
  },
  {
   "name": "jupiter",
   "ms": 133,
   "sum": {
    "found": true,
    "name": "Bonk",
    "symbol": "Bonk",
    "icon": "https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I",
    "dev": "9AhKqLR67hwapvG8SA2JFXaCshXc9nALJjpKaHZrsbkw",
    "launchpad": null,
    "verified": true,
    "tags": [
     "strict",
     "verified",
     "meme",
     "birdeye-trending",
     "community",
     "… 1 more"
    ],
    "holders": 1026329,
    "organic_score": 86.14367236149229,
    "organic_label": "high",
    "organic_volume_pct": 10.7,
    "volume_24h": 817746,
    "traders_24h": 3532,
    "net_buyers_24h": 958,
    "buys_24h": 14163,
    "sells_24h": 15087,
    "price_change_24h": -0.9,
    "price_change_1h": -0.1,
    "holder_change_24h": 0,
    "liquidity": 6259290,
    "mcap": 269300373,
    "price": 3.0604278203842528e-06,
    "audit": {
     "mint_disabled": true,
     "freeze_disabled": true,
     "top_holders_pct": 30.3,
     "dev_balance_pct": 0,
     "dev_mints": 10,
     "dev_migrations": null
    },
    "created": "2024-06-07T10:26:40.709Z"
   }
  },
  "… 5 more"
 ],
 "readout": {
  "rug_guard": {
   "ok": false,
   "reasons": [
    "top 10 holders own 38% (max 35%)"
   ],
   "warn": [
    "not a pump.fun launch we saw (no curve history)"
   ],
   "dev": null,
   "top10_pct": 38.3,
   "bundle": null,
   "transfer_held_pct": 0,
   "rugcheck_score": 7,
   "rugcheck": {
    "score": 7,
    "risks": [
     {
      "name": "Mutable metadata",
      "level": "warn"
     }
    ],
    "insiderNetworks": 48,
    "insiderPct": 0,
    "transferHolderPct": 0,
    "transferHolders": [],
    "creatorTokens": 0,
    "top10": 38.3
   },
   "holders": {
    "top10": 38.3,
    "top": [
     {
      "wallet": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
      "pct": 8.83,
      "insider": false
     },
     {
      "wallet": "51yZyDSnec4xnUv7XLRVYcDyV4x3wUtzrDcRaYbmQU5j",
      "pct": 6.79,
      "insider": false
     },
     {
      "wallet": "4xLpwxgYuPwPvtQjE94RLS4WZ4aD8NJYYKr2AJk99Qdg",
      "pct": 3.7,
      "insider": false
     },
     {
      "wallet": "9RpzaFh4J8F6Qg1gjnhrhSp9eXdVDjsesZXe53qp7ubB",
      "pct": 3.06,
      "insider": false
     },
     {
      "wallet": "EbLm4ZtRqDftrQnZaMMvnwcKjK5ef5vm1Hg3sAPv3tKi",
      "pct": 3.04,
      "insider": false
     },
     "… 5 more"
    ],
    "source": "RugCheck"
   }
  },
  "kind": "token",
  "mint": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  "symbol": "Bonk",
  "name": "Bonk",
  "verdict": {
   "level": "good",
   "label": "Known asset",
   "line": "Bonk is an established token."
  },
  "score": 100,
  "grade": "A",
  "on_curve": false,
  "facts": {
   "price_usd": 3.059e-06,
   "mcap_usd": 271915646,
   "peak_mcap_usd": null,
   "liquidity_usd": 1448957.17,
   "volume_24h_usd": 130025.59,
   "curve_pct": null,
   "grad_odds_pct": null,
   "grad_base_pct": null,
   "wallets": null,
   "net_sol": null,
   "buys": 2852,
   "sells": 3393,
   "age_h": 33397.5,
   "program": "SPL Token"
  },
  "checks": [
   {
    "s": "ok",
    "t": "Mint authority revoked"
   },
   {
    "s": "ok",
    "t": "Freeze authority revoked"
   },
   {
    "s": "ok",
    "t": "No hidden transfer fees, hooks or delegates"
   },
   {
    "s": "warn",
    "t": "Name/image can still be changed by the dev"
   },
   {
    "s": "ok",
    "t": "Liquidity $1,448,957"
   },
   "… 1 more"
  ],
  "counts": {
   "bad": 1,
   "warn": 1
  },
  "positives": [],
  "risks": [
   "No red flags in the contract or the market structure.",
   "Recognised major token (BONK), matched by mint address. Its issuer controls are listed as notes, not penalised.",
   "Metadata is mutable (recognised major token, not penalised)."
  ],
  "top_holders": [],
  "links": {
   "dexscreener": "https://dexscreener.com/solana/5zpyutju9ee6jfymdgok7f6s5kczqtc9fomp3uekuya9",
   "pumpfun": "https://pump.fun/coin/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
   "solscan": "https://solscan.io/token/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
  },
  "tools": [
   "token_risk",
   "launch_scan"
  ],
  "deep": {
   "jupiter": {
    "found": true,
    "name": "Bonk",
    "symbol": "Bonk",
    "icon": "https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I",
    "dev": "9AhKqLR67hwapvG8SA2JFXaCshXc9nALJjpKaHZrsbkw",
    "launchpad": null,
    "verified": true,
    "tags": [
     "strict",
     "verified",
     "meme",
     "birdeye-trending",
     "community",
     "… 1 more"
    ],
    "holders": 1026329,
    "organic_score": 86.14367236149229,
    "organic_label": "high",
    "organic_volume_pct": 10.7,
    "volume_24h": 817746,
    "traders_24h": 3532,
    "net_buyers_24h": 958,
    "buys_24h": 14163,
    "sells_24h": 15087,
    "price_change_24h": -0.9,
    "price_change_1h": -0.1,
    "holder_change_24h": 0,
    "liquidity": 6259290,
    "mcap": 269300373,
    "price": 3.0604278203842528e-06,
    "audit": {
     "mint_disabled": true,
     "freeze_disabled": true,
     "top_holders_pct": 30.3,
     "dev_balance_pct": 0,
     "dev_mints": 10,
     "dev_migrations": null
    },
    "created": "2024-06-07T10:26:40.709Z"
   },
   "dexscreener": {
    "found": true,
    "pools": 1,
    "liquidity": 314284,
    "volume_24h": 130026,
    "main": {
     "dex": "orca",
     "pair": "5zpyutJu9ee6jFymDGoK7F6S5Kczqtc9FomP3ueKuyA9",
     "liq": 314283.86,
     "vol24": 130025.59,
     "tx5m": {
      "buys": 5,
      "sells": 0
     },
     "tx1h": {
      "buys": 83,
      "sells": 54
     },
     "tx24h": {
      "buys": 2852,
      "sells": 3393
     },
     "chg": {
      "m5": 0.08,
      "h1": 0.07,
      "h6": 0.52,
      "h24": -0.94
     },
     "created": 1671980424000,
     "url": "https://dexscreener.com/solana/5zpyutju9ee6jfymdgok7f6s5kczqtc9fomp3uekuya9"
    },
    "image": "https://cdn.dexscreener.com/cms/images/ba03c0370670d176dc33bbd212eb023337a460ad7edfa053ca96ae22f31c3dcf?width=800&height=800&quality=95&format=auto",
    "socials": [
     "twitter",
     "telegram",
     "discord"
    ],
    "websites": 1,
    "boosts": 0,
    "mcap": 269258866,
    "first_pool": 1671980424000
   },
   "dev": {
    "found": true,
    "creator": "9AhKqLR67hwapvG8SA2JFXaCshXc9nALJjpKaHZrsbkw",
    "username": "dev_username",
    "followers": 6,
    "banned": false,
    "coin": {
     "ath_mcap": 730179078,
     "mcap": 268868020,
     "replies": null,
     "complete": false,
     "twitter": true,
     "telegram": false,
     "website": true,
     "created": 1670531612000
    },
    "launches_seen": 1,
    "capped": false,
    "other_launches": 0,
    "launches_24h": 0,
    "launches_7d": 0,
    "graduated": 0,
    "graduation_rate_pct": null,
    "collapsed_pct": null,
    "median_ath": null,
    "median_now": null,
    "median_drawdown_pct": null,
    "best": null,
    "recent": []
   },
   "flow": {
    "found": false
   },
   "people": {
    "callers": [
     {
      "name": "caller_1",
      "wallet": "5yRz1Hd5puQWrGJnfahgEmaMrqPat2CgZ9V2o9fHkXoq",
      "tier": null,
      "score": null,
      "at_mcap": 348856931,
      "x_now": 0.87,
      "x_peak": 1.03,
      "t": 1791152489616
     },
     {
      "name": "caller_2",
      "wallet": "8WE9nN4q7ocGtxuQJ769mUg9C89tu6fFVEm8H4vYXojT",
      "tier": null,
      "score": null,
      "at_mcap": 335196903,
      "x_now": 0.9,
      "x_peak": 1,
      "t": 1791288815013
     },
     {
      "name": "caller_3",
      "wallet": "3bhkfJMMEGfNv54XCNtW2d5D95umrx1FQ1DdXMGGNPjV",
      "tier": null,
      "score": null,
      "at_mcap": 298125525,
      "x_now": 0.99,
      "x_peak": 1,
      "t": 1791530001801
     },
     {
      "name": "caller_4",
      "wallet": "2YXKR5e5ajAQogNcfEpdkNZuPvmhsjZCX7MtyRJU7Mht",
      "tier": null,
      "score": null,
      "at_mcap": 297539155,
      "x_now": 1,
      "x_peak": 1,
      "t": 1791697402107
     }
    ],
    "callers_n": 4,
    "traders": [],
    "traders_n": 0,
    "top_pnl_n": 0,
    "top_pnl_net_sol": 0
   },
   "model": null
  }
 },
 "ms": 1259
}
```
</details>

<details><summary><b>EVM token on Base</b> (verdict: Avoid, owner can mint)</summary>

```json
{
 "ok": true,
 "cores": [
  {
   "name": "market",
   "ms": 430,
   "sum": {
    "symbol": "DEGEN",
    "name": "Degen",
    "price": 0.000937943108737336,
    "mcap": 33766986.403263494,
    "liq": 109008.08,
    "icon": "https://cdn.dexscreener.com/cms/images/c865067e6e29f660b5d0c2a69814875c7415c3fc0022434651525c21f03cc24a?width=800&height=800&quality=95&format=auto"
   }
  },
  {
   "name": "holders",
   "ms": 473,
   "sum": {
    "none": true
   }
  },
  {
   "name": "contract",
   "ms": 523,
   "sum": {
    "has_owner_fn": true,
    "renounced": false,
    "upgradeable": false,
    "levers": [
     "pause"
    ]
   }
  },
  {
   "name": "honeypot",
   "ms": 589,
   "sum": {
    "honeypot": false,
    "buy_tax": 0,
    "sell_tax": 0
   }
  },
  {
   "name": "goplus",
   "ms": 758,
   "sum": {
    "honeypot": false,
    "mintable": true,
    "open_source": true,
    "holders": "1182412"
   }
  },
  "… 1 more"
 ],
 "readout": {
  "kind": "token",
  "evm": true,
  "chain": "base",
  "chain_label": "Base",
  "mint": "0x4ed4e862860bed51a9570b96d89af5e1b0efefed",
  "symbol": "DEGEN",
  "name": "Degen",
  "icon": "https://cdn.dexscreener.com/cms/images/c865067e6e29f660b5d0c2a69814875c7415c3fc0022434651525c21f03cc24a?width=800&height=800&quality=95&format=auto",
  "verdict": {
   "level": "danger",
   "label": "Avoid",
   "line": "Owner can mint more tokens."
  },
  "score": 20,
  "grade": "F",
  "on_curve": false,
  "facts": {
   "price_usd": 0.000937943108737336,
   "mcap_usd": 33766986.403263494,
   "liquidity_usd": 109008.08,
   "volume_24h_usd": 27588.68,
   "buys": 0,
   "sells": 4,
   "age_h": 24321,
   "holders": 1182412,
   "buy_tax_pct": 0,
   "sell_tax_pct": 0
  },
  "checks": [
   {
    "s": "ok",
    "t": "Test buy and sell both went through"
   },
   {
    "s": "ok",
    "t": "No buy or sell tax"
   },
   {
    "s": "warn",
    "t": "Owner still in control (0x704e…3c0d)"
   },
   {
    "s": "bad",
    "t": "Owner can mint more tokens",
    "kind": "mint"
   },
   {
    "s": "bad",
    "t": "Owner can pause trading",
    "kind": "pause"
   },
   "… 2 more"
  ],
  "counts": {
   "bad": 2,
   "warn": 1
  },
  "positives": [],
  "risks": [],
  "top_holders": [],
  "contract": {
   "owner": "0x704ec5c12ca20a293c2c0b72b22619a4231f3c0d",
   "renounced": false,
   "upgradeable": false,
   "levers": [
    "pause"
   ]
  },
  "links": {
   "dexscreener": "https://dexscreener.com/base/0x4ed4e862860bed51a9570b96d89af5e1b0efefed",
   "explorer": "https://basescan.org/token/0x4ed4e862860bed51a9570b96d89af5e1b0efefed"
  },
  "bundle": {
   "verdict": "skip",
   "reasons": [
    "contract: owner can mint more"
   ],
   "exact": false,
   "holders": 1182412,
   "top10_pct": 22,
   "transfer_held_pct": null,
   "fresh_held_pct": null,
   "vault_held_pct": null,
   "first_seconds": 2,
   "first_buyers": 0,
   "first_bought_pct": 0,
   "first_still_held_pct": null,
   "airdrop": {
    "wallets": 0,
    "contracts": 0,
    "pct": 0
   },
   "scripted": null,
   "dev": null,
   "dev_held_pct": null,
   "launchpad": "uniswap",
   "wallets": [
    {
     "wallet": "0x06a19654e0872ba71c2261ea691ecf8a0c677156",
     "pct": 22.6,
     "kind": "contract",
     "source": "GoPlus"
    },
    {
     "wallet": "0x82d4cd9bf16017fd518511d8bbe6d0493af31a10",
     "pct": 5.62,
     "kind": "wallet",
     "source": "GoPlus"
    },
    {
     "wallet": "0xefef4558802bf373ce3307189c79a9cab0a4cb9c",
     "pct": 5.4,
     "kind": "contract",
     "source": "GoPlus"
    },
    {
     "wallet": "0x9773c9e7d048ae91a4fd9a48cd0b984e31fa418c",
     "pct": 5.3,
     "kind": "wallet",
     "source": "GoPlus"
    },
    {
     "wallet": "0x7d00d30269fc62ab5fab54418feedbdc71fdb25f",
     "pct": 5.13,
     "kind": "contract",
     "source": "GoPlus"
    },
    "… 3 more"
   ],
   "first": []
  },
  "tools": [
   "evm_onchain",
   "evm_market",
   "honeypot_sim",
   "goplus",
   "bundle_forensics"
  ]
 },
 "ms": 965
}
```
</details>

Names of wallets and callers in these samples are anonymised. Everything else is real output.
