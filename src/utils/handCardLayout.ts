/** Расстояние между картами в руке (должно совпадать с gap в `Hands/styles`). */
export const HAND_CARD_GAP_PX = 12;

const CARD_MAX_W_PX = 118;
const CARD_MIN_W_PX = 36;

/**
 * Ширина одной карты так, чтобы все карты поместились в один ряд
 * (при необходимости уменьшается относительно десктопных 118px).
 */
export function cardWidthForSingleRow(
  containerInnerWidth: number,
  cardCount: number,
  gap: number = HAND_CARD_GAP_PX,
): number {
  if (cardCount <= 0 || containerInnerWidth <= 0) {
    return CARD_MAX_W_PX;
  }
  const raw = (containerInnerWidth - (cardCount - 1) * gap) / cardCount;
  return Math.max(CARD_MIN_W_PX, Math.min(CARD_MAX_W_PX, raw));
}
