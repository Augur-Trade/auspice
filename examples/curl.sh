#!/usr/bin/env bash
# Rugscope from the shell. Needs curl + jq.
set -euo pipefail
Q=${1:-DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263}

# verdict, score and the failed checks
curl -s "https://augur-trade.com/hub/api/v1/rugscope?q=$Q" | jq '{verdict: .readout.verdict, score: .readout.score, grade: .readout.grade,
  bad: [.readout.checks[] | select(.s != "ok") | .t], dump_odds: .readout.deep.model.p_rug}'

# watch the engines report live
curl -sN "https://augur-trade.com/hub/api/v1/rugscope?q=$Q&stream=1" | grep --line-buffered '^event:'
