import { type Card } from '../types/card';
import handValue from './handValue';

function isBlackjack(cards: Card[]): boolean {
  return cards.length === 2 && handValue(cards) === 21;
}

export default isBlackjack;
