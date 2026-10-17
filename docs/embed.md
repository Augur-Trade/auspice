# Links, embeds and token reports

**Deep link to a scan:** `https://augur-trade.com/rug/?q=<address>` (add `&chain=base` etc. for EVM). The scan starts on load.

**Embed it** in your app or site. The embed mode hides the site header, hero and footer:

```html
<iframe src="https://augur-trade.com/rug/?embed=1&q=<address>" style="width:100%;height:900px;border:0;border-radius:16px" loading="lazy"></iframe>
```

**Token reports:** every liquid token has a crawlable report page, `https://augur-trade.com/rug/t/<mint>`, listed at [`https://augur-trade.com/rug/tokens/`](https://augur-trade.com/rug/tokens/).

**In the A.U.G.U.R app:** Rugscope is built in. Every token page has a *Rug scan* button, and snipers run the [rug guard](verdicts.md#the-rug-guard) before every buy.
