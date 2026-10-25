# The engines

Every scan fires its engines **in parallel**, and each one reports as soon as it finishes (watch it live with `stream=1`).

## Solana: 10 engines

| # | Engine | Checks | Data |
|---|---|---|---|
| 01 | **Contract** (`contract`) | Mint and freeze authority, metadata mutability, the token program, liquidity and the A.U.G.U.R safety grade. | Solana RPC |
| 02 | **Launch model** (`launch`) | For pump.fun launches: graduation odds and launch shape against every comparable launch on our tape. | our pump.fun tape |
| 03 | **Token-2022** (`t22`) | Hidden traps in Token-2022 extensions: transfer fees, transfer hooks, permanent delegate, pausable, confidential transfers. | Solana RPC |
| 04 | **Bundle forensics** (`bundle`) | Who bought in block 0, how much supply the bundle took and still holds, tokens handed out without a buy, insiders, and holder concentration. | our tape + RugCheck |
| 05 | **Jupiter** (`jupiter`) | Organic volume and organic score, holder count, and the developer's all-time mints and migrations. | Jupiter |
| 06 | **Dexscreener** (`dexscreener`) | Pools, liquidity, volume and buy/sell flow over 5 minutes, 1 hour and 24 hours. | Dexscreener |
| 07 | **Dev dossier** (`devhist`) | Every coin the creator launched: how many graduated, how many collapsed 90% from peak, median drawdown, launch cadence, whether the dev still holds or has sold. | pump.fun |
| 08 | **Tape flow** (`flow`) | Price, market cap and buy/sell flow from our own recording of every bonding-curve trade, with peak and "already dumped" detection. | our pump.fun tape |
| 09 | **Known wallets** (`people`) | Callers who called the coin and named, profitable traders who are in it (net SOL in or out). | our caller + wallet index |
| 10 | **Probability model** (`model`) | The chance this coin dumps 50% in the next hour, with a 90% range and the reasons that pushed it. | gradient-boosted model, our data |

## EVM: 6 engines on 13 chains

| # | Engine | Checks | Data |
|---|---|---|---|
| 01 | **Market** (`market`) | Price, market cap, liquidity and volume of the main pool. | Dexscreener |
| 02 | **Owner powers** (`contract`) | Whether an owner exists and can still mint, pause, blacklist, change fees or upgrade the contract. | on-chain bytecode + calls |
| 03 | **Honeypot simulation** (`honeypot`) | A simulated buy and sell: can you actually sell, and at what tax. | on-chain simulation |
| 04 | **GoPlus** (`goplus`) | A second opinion on honeypot, mintable, open-source and holder count. | GoPlus Security |
| 05 | **Holders** (`holders`) | Top-holder concentration and holder count. | on-chain |
| 06 | **Launch forensics** (`bundle`) | Who bought in the first blocks, airdrops at creation and supply taken by the launch buyers. | on-chain logs |

Chains: Robinhood Chain (`robinhood`), Base (`base`), Ethereum (`ethereum`), BNB Chain (`bsc`), Arbitrum (`arbitrum`), Polygon (`polygon`), Optimism (`optimism`), Avalanche (`avalanche`), Linea (`linea`), Sonic (`sonic`), Unichain (`unichain`), Berachain (`berachain`), HyperEVM (`hyperevm`).

"Our tape" is A.U.G.U.R's own live recording of every pump.fun bonding-curve trade since September 2026: tens of millions of trades and hundreds of thousands of launches. It is why Auspice can see bundles, dev behaviour and flow the moment a coin launches, before aggregators index it.
