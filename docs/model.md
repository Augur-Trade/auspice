# Model card: Auspice dump probability

**Question it answers:** for a pump.fun coin still on its bonding curve, what is the chance it **falls 50% within the
next hour**?

| | |
|---|---|
| Output | `p_rug` (%), a 90% range (`lo`–`hi`), the base rate, `lift` over the base rate, and per-feature `contributions` |
| Scope | Solana pump.fun coins **on the bonding curve**. Graduated coins are not scored (by design) |
| Method | Gradient-boosted decision trees, plus a bag of 7 models for the 90% range; calibrated per decile |
| Training data | 48,857 random moments in launches from our own pump.fun tape (base rate 19.4%), plus real caller calls |
| Features | 37 live signals: net SOL flow over 1/5/10 minutes and since launch, market cap, curve progress, top-10 and block-0 concentration, flippers, trading acceleration, dev buy and holdings, the dev's launches in the last 24 hours, and more |

## How good is it

Tested on later data than it was trained on (time split 70/30):

| Test set | AUC |
|---|---|
| Held-out random moments | **0.837** |
| Active coins only | 0.833 |
| Busy coins only | 0.829 |
| Real calls from Telegram callers | **0.753** |

Calibration per decile is close (for example a predicted 24% came true 26% of the time, a predicted 52% 54%).

## How to read it

- It is a **ranking aid, not a prophecy.** 26% means "about one in four coins like this dumped 50% within the hour",
  not "this one will".
- Compare it with the **base rate** (19.4%): `lift` 1.36 means 36% riskier than a typical moment.
- `contributions` show what pushed the number: red pushes toward a dump, green away. In the sample below, heavy net
  SOL inflow since launch is the biggest red push and a larger market cap the biggest green one.
- It does not know about off-chain news, a dev's promises or a coordinated raid that hasn't started yet.
- A coin that has **already dumped** can score low. Check `from_peak_pct` and the ALREADY DUMPED status.

<details><summary><b>Real model output</b> (on-curve coin, trimmed)</summary>

```json
{
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
  {
   "k": "dev_prior_24h",
   "label": "dev launches, 24 h",
   "value": 0,
   "push": -0.11
  },
  {
   "k": "net_5m",
   "label": "net SOL, 5 min",
   "value": 4.281,
   "push": -0.107
  },
  {
   "k": "log_n_5m",
   "label": "trades, 5 min",
   "value": 6.082,
   "push": -0.102
  },
  "… 29 more"
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
```
</details>
