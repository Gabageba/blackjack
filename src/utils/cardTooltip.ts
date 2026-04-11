import type { TFunction } from 'i18next';
import { type Card } from '../types/card';

/** Текст подсказки с очками карты в блэкджеке (туз — 1 или 11). */
export function cardBlackjackTooltip(card: Card, t: TFunction): string {
  if (card.rank === 'A') {
    return t('game.cardTooltipAce');
  }
  if (card.rank === 'J' || card.rank === 'Q' || card.rank === 'K' || card.rank === '10') {
    return t('game.cardTooltipPoints', { count: 10 });
  }
  const n = Number.parseInt(card.rank, 10);
  return t('game.cardTooltipPoints', { count: n });
}
