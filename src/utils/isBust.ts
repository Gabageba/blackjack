import { type Card } from '../types/card';
import handValue from './handValue';

function isBust(cards: Card[]): boolean {
  return handValue(cards) > 21;
}

export default isBust;
