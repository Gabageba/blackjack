import { type Card } from '../types/card';
import handValue from './handValue';

function dealerShouldHit(cards: Card[]): boolean {
  return handValue(cards) < 17;
}

export default dealerShouldHit;
