import { type Rank, type Card } from '../types/card';

function rankValue(rank: Rank): number {
  if (rank === 'J' || rank === 'Q' || rank === 'K') return 10;
  if (rank === 'A') return 0;
  return Number.parseInt(rank, 10);
}

function handValue(cards: Card[]): number {
  let total = 0;
  let aces = 0;
  for (const c of cards) {
    if (c.rank === 'A') aces++;
    else total += rankValue(c.rank);
  }
  for (let i = 0; i < aces; i++) {
    if (total + 11 <= 21) total += 11;
    else total += 1;
  }
  return total;
}

export default handValue;
