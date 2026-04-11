const BALANCE_KEY = 'blackjack-balance';

const DEFAULT_BALANCE = 1000;

export function readStoredBalance(): number {
  if (typeof window === 'undefined') {
    return DEFAULT_BALANCE;
  }
  const raw = window.localStorage.getItem(BALANCE_KEY);
  if (raw === null || raw === '') {
    writeStoredBalance(DEFAULT_BALANCE);
    return DEFAULT_BALANCE;
  }
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n) || n < 0) {
    writeStoredBalance(DEFAULT_BALANCE);
    return DEFAULT_BALANCE;
  }
  return n;
}

export function writeStoredBalance(value: number): void {
  if (typeof window === 'undefined') {
    return;
  }
  const clamped = Math.max(0, Math.floor(value));
  window.localStorage.setItem(BALANCE_KEY, String(clamped));
}

const BET_KEY = 'blackjack-last-bet';
const DEFAULT_BET = 25;
const MAX_BET = 500;

export function readStoredBet(): number {
  if (typeof window === 'undefined') {
    return DEFAULT_BET;
  }
  const raw = window.localStorage.getItem(BET_KEY);
  if (raw === null || raw === '') {
    writeStoredBet(DEFAULT_BET);
    return DEFAULT_BET;
  }
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n) || n < 1) {
    writeStoredBet(DEFAULT_BET);
    return DEFAULT_BET;
  }
  return Math.min(MAX_BET, n);
}

export function writeStoredBet(value: number): void {
  if (typeof window === 'undefined') {
    return;
  }
  const clamped = Math.max(1, Math.min(MAX_BET, Math.floor(value)));
  window.localStorage.setItem(BET_KEY, String(clamped));
}
