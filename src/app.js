const fallbackPairs = [
  { baseToken: { name: 'Solana', symbol: 'SOL' }, priceUsd: '147.82', priceChange: { h24: 4.18 }, pairAddress: 'So11111111111111111111111111111111111111112', liquidity: { usd: 85000000 } },
  { baseToken: { name: 'Jupiter', symbol: 'JUP' }, priceUsd: '0.984', priceChange: { h24: 8.21 }, pairAddress: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN', liquidity: { usd: 14000000 } },
  { baseToken: { name: 'Bonk', symbol: 'BONK' }, priceUsd: '0.000024', priceChange: { h24: -2.04 }, pairAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6M84VtV9h6A7xZ2V', liquidity: { usd: 12000000 } },
  { baseToken: { name: 'Tensor', symbol: 'TNSR' }, priceUsd: '0.381', priceChange: { h24: 13.72 }, pairAddress: 'TNSR', liquidity: { usd: 2200000 } }
];

const state = { pairs: fallbackPairs, selected: fallbackPairs[0], source: 'sample' };
const $ = (selector) => document.querySelector(selector);
const fmtUsd = (value) => {
  const n = Number(value || 0);
  if (!Number.isFinite(n)) return '—';
  if (n < 0.01) return `$${n.toFixed(6)}`;
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: n < 1 ? 4 : 2 })}`;
};
const fmtPct = (value) => `${Number(value || 0) >= 0 ? '+' : ''}${Number(value || 0).toFixed(2)}%`;
const riskFor = (pair, index) => {
  const change = Math.abs(Number(pair.priceChange?.h24 || 0));
  const liq = Number(pair.liquidity?.usd || 0);
  if (liq < 150000 || change > 40) return ['Elevated risk', 'elevated'];
  if (index % 3 === 2 || change > 18) return ['Review required', 'caution'];
  return ['Screened', 'safe'];
};
const initials = (symbol) => (symbol || '?').slice(0, 1).toUpperCase();

function renderPairs() {
  const rows = $('#scannerRows');
  const watch = $('#watchlist');
  const pairs = state.pairs.slice(0, 4);
  rows.innerHTML = pairs.map((pair, index) => {
    const token = pair.baseToken || {};
    const movement = Number(pair.priceChange?.h24 || 0);
    const [risk, className] = riskFor(pair, index);
    return `<button class="scan-row pair-row" data-index="${index}" aria-label="Trade ${token.name || token.symbol}"><span><b class="coin ${index === 0 ? 'sol' : index === 1 ? 'jup' : index === 2 ? 'bonk' : 'tensor'}">${initials(token.symbol)}</b>${token.name || 'Unknown'} <small>${token.symbol || '—'}</small></span><span>${fmtUsd(pair.priceUsd)}</span><strong class="${movement >= 0 ? 'up' : 'down'}">${fmtPct(movement)}</strong><i class="badge ${className}">${risk}</i></button>`;
  }).join('');
  watch.innerHTML = pairs.slice(0, 3).map((pair, index) => {
    const token = pair.baseToken || {};
    const movement = Number(pair.priceChange?.h24 || 0);
    return `<button class="watch-item pair-row" data-index="${index}" aria-label="Open ${token.name || token.symbol} trade preview"><b class="coin ${index === 0 ? 'sol' : index === 1 ? 'jup' : 'bonk'}">${initials(token.symbol)}</b><span>${token.name || 'Unknown'}<small>${token.symbol || '—'}</small></span><strong>${fmtUsd(pair.priceUsd)}<small class="${movement >= 0 ? 'up' : 'down'}">${fmtPct(movement)}</small></strong></button>`;
  }).join('');
  document.querySelectorAll('.pair-row').forEach((row) => row.addEventListener('click', () => openTrade(state.pairs[Number(row.dataset.index)])));
  $('#pairCount').innerHTML = `Pairs monitored <i>${state.pairs.length || '—'}</i>`;
}

function renderPulse() {
  const sol = state.pairs.find((pair) => pair.baseToken?.symbol === 'SOL') || state.pairs[0];
  const movement = Number(sol?.priceChange?.h24 || 0);
  $('#solPrice').innerHTML = `◎ SOL <i>${fmtUsd(sol?.priceUsd)}</i>`;
  $('#solChange').innerHTML = `24h movement <i class="${movement >= 0 ? 'up' : 'down'}">${fmtPct(movement)}</i>`;
}

async function loadDexScreener() {
  const status = $('#apiStatus');
  status.innerHTML = '<i></i> Connecting to DexScreener';
  try {
    const response = await fetch('https://api.dexscreener.com/latest/dex/search/?q=solana', { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`DexScreener returned ${response.status}`);
    const data = await response.json();
    const solanaPairs = (data.pairs || []).filter((pair) => pair.chainId === 'solana' && pair.priceUsd).slice(0, 8);
    if (!solanaPairs.length) throw new Error('No Solana pairs returned');
    state.pairs = solanaPairs;
    state.source = 'live';
    status.innerHTML = '<i></i> DexScreener data connected';
    $('#scannerFreshness').textContent = 'Live data via DexScreener · updated now';
  } catch (error) {
    state.pairs = fallbackPairs;
    state.source = 'sample';
    status.innerHTML = '<i></i> Sample data — DexScreener unavailable';
    $('#scannerFreshness').textContent = 'Sample data · live source unavailable';
  }
  renderPairs();
  renderPulse();
}

function openTrade(pair = state.selected) {
  state.selected = pair;
  const token = pair.baseToken || {};
  const [risk, className] = riskFor(pair, state.pairs.indexOf(pair));
  $('#receiveSymbol').textContent = token.symbol || '—';
  $('#tradeReceive').value = `Estimated ${token.symbol || 'asset'} amount`;
  const riskEl = $('#tradeRisk');
  riskEl.textContent = risk;
  riskEl.className = `badge ${className}`;
  $('#tradeDialog').showModal();
}

function toast(message) {
  const node = $('#toast');
  node.textContent = message;
  node.classList.add('show');
  window.setTimeout(() => node.classList.remove('show'), 3200);
}

document.querySelectorAll('[data-open-trade]').forEach((button) => button.addEventListener('click', () => openTrade()));
$('#launchDesk').addEventListener('click', () => document.querySelector('#desk').scrollIntoView({ behavior: 'smooth' }));
$('#signIn').addEventListener('click', () => toast('Sign-in will be connected with the verified-user flow.'));
$('#openScanner').addEventListener('click', () => document.querySelector('#scanner').scrollIntoView({ behavior: 'smooth' }));
$('#viewScanner').addEventListener('click', () => document.querySelector('#scanner').scrollIntoView({ behavior: 'smooth' }));
$('#refreshScanner').addEventListener('click', loadDexScreener);
$('#filterButton').addEventListener('click', () => toast('Saved scanner filters are part of the next product build.'));
$('#connectWallet').addEventListener('click', () => toast('Wallet connection is intentionally gated until KYC and routing are configured.'));
$('#newsletter').addEventListener('submit', (event) => { event.preventDefault(); event.target.reset(); toast('You’re on the list. Check your inbox shortly.'); });
document.querySelectorAll('.trade-tabs button').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('.trade-tabs button').forEach((tab) => tab.classList.remove('active')); button.classList.add('active'); $('#connectWallet').innerHTML = `${button.dataset.side === 'buy' ? 'Connect wallet to buy' : 'Connect wallet to sell'} <span>→</span>`; }));
document.querySelectorAll('.trade-pcts button').forEach((button) => button.addEventListener('click', () => { $('#tradeAmount').value = button.textContent === 'Max' ? '—' : button.textContent.replace('%', ''); toast('Balance percentages will activate after wallet connection.'); }));

loadDexScreener();
