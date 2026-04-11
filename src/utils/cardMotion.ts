/** Пауза между картами при раздаче и доборе дилера (мс). */
export const DEAL_STAGGER_MS = 280;
/** Длительность анимации появления карты с «полки» (см. `cardDealPop` в Card/styles). */
export const CARD_DEAL_ANIM_MS = 480;
/** Переворот скрытой (второй) карты дилера с рубашки на лицо. */
export const CARD_FLIP_MS = 580;
/** Момент окончания анимации последней из 4 стартовых карт. */
export const INITIAL_DEAL_FINISH_MS = DEAL_STAGGER_MS * 3 + CARD_DEAL_ANIM_MS;
/** После открытия дыры: ждём и анимацию новой карты, и переворот — что дольше. */
export const HOLE_REVEAL_MODAL_DELAY_MS = Math.max(CARD_DEAL_ANIM_MS, CARD_FLIP_MS);
