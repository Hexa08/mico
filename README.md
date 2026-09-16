# Kestrel

Kestrel is a premium, safety-aware Solana market intelligence interface. This first build contains a responsive Desk, Scanner, safety content, Polar-ready pricing presentation, and a gated Buy/Sell preview.

## Run locally

This is a static web app. From the repository root:

```bash
python3 -m http.server 4173
```

Then visit `http://localhost:4173`.

## DexScreener data

`src/app.js` queries the public DexScreener search API for Solana pairs. It includes clearly labeled sample-data fallback handling for offline, rate-limited, or unavailable API situations. The API is used only for discovery/display in this build; it does not submit trades.

## Trading and KYC

The Buy/Sell panel is deliberately a gated preview. Live wallet connection, KYC verification, transaction routing, quotes, simulation, and signed Solana transactions require server-side integration and must not be exposed through client-side secrets. See `design.md` for the approved safety and rollout constraints.
