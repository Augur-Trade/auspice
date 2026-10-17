"""python3 scan.py <address> [chain]: standard library only."""
import json
import sys
import urllib.parse
import urllib.request

API = "https://augur-trade.com/hub/api/v1/rugscope"
q = sys.argv[1] if len(sys.argv) > 1 else "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
params = {"q": q}
if len(sys.argv) > 2:
    params["chain"] = sys.argv[2]
req = urllib.request.Request(API + "?" + urllib.parse.urlencode(params), headers={"User-Agent": "rugscope-example"})
with urllib.request.urlopen(req, timeout=60) as r:
    readout = json.load(r)["readout"]

v = readout["verdict"]
print(f"{readout.get('symbol')}: {v['label']} ({readout.get('score')}/100, grade {readout.get('grade')}): {v['line']}")
for c in readout.get("checks", []):
    if c["s"] != "ok":
        print(("  x " if c["s"] == "bad" else "  ! ") + c["t"])
model = (readout.get("deep") or {}).get("model")
if model:
    print(f"  dump within the hour: {model['p_rug']}% (90% range {model['lo']}-{model['hi']}%), base {model['base_rate']}%")
