# Kestrel — Product Design Direction

Kestrel is a warm editorial Solana market-intelligence workspace—not a terminal or generic AI dashboard. The product pairs a focused Desk, market Scanner, watchlists, alerts, and token research with explicit safety context.

## Approved visual direction

- Paper `#F5F4EE`, ink `#171816`, and restrained lime `#C9F54A` primary accents.
- DM Sans for UI, Playfair Display for editorial headlines, and DM Mono only for technical metadata.
- Curated React Bits micro-interactions, OriginKit application primitives, and one subtle custom Shader visual treatment. Components are adapted into Kestrel’s own accessible system, never shipped as templates.
- Respect reduced-motion preferences and WCAG 2.2 AA interaction, contrast, focus, and keyboard targets.

## Initial product scope

1. Desk: personal market brief, watchlist movements, action centre, and data freshness.
2. Scanner: Solana pair discovery with price, movement, risk state, and methodology context.
3. Research: token context, risk evidence, reports, and external explorer links.
4. Safety: layered `Screened`, `Review required`, `Elevated risk`, and `Insufficient data` states.
5. Billing: Polar-hosted subscription checkout and customer portal, with webhook-verified entitlements.

## DexScreener and trading constraints

DexScreener provides market discovery data in this build. It is not a wallet, broker, or trade-execution provider. The Buy/Sell experience remains a preview until KYC eligibility, wallet connection, a Solana routing provider, quote/simulation checks, transaction signing, and transaction-state verification are implemented securely.

Kestrel must not custody private keys, claim a token is safe, automatically execute a trade from a scanner result, or permanently ban a user based solely on a browser/device identifier. High-risk reports require documented review, proportionate enforcement, and an appeal path.
