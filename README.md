# Kestrel

Kestrel is a premium, safety-aware Solana market intelligence interface. This first build contains a responsive Desk, Scanner, safety content, Polar-ready pricing presentation, and a gated Buy/Sell preview.

## Run locally

This is a Vite + React web app. From the repository root:

```bash
npm install
npm run dev
```

Then visit the local Vite URL shown in the terminal.

For a production verification build:

```bash
npm run build
```

## DexScreener data

`src/App.jsx` queries the public DexScreener search API for Solana pairs. It includes clearly labeled sample-data fallback handling for offline, rate-limited, or unavailable API situations. The API is used only for discovery/display in this build; it does not submit trades.

## Motion components

The React implementation adds the supplied Originkit-inspired `RoundCarousel` and `AppearText` components. Both are local components, and the carousel plus text animation respect reduced-motion preferences.

## Trading and KYC

The Buy/Sell panel is deliberately a gated preview. Live wallet connection, KYC verification, transaction routing, quotes, simulation, and signed Solana transactions require server-side integration and must not be exposed through client-side secrets. See `design.md` for the approved safety and rollout constraints.
