export enum Phase {
  /** Выбор суммы и подтверждение «ОК» */
  BET_CHOICE = 'bet-choice',
  /** Ставка зафиксирована, можно «Раздать» */
  DEAL_READY = 'deal-ready',
  PLAY = 'play',
  OVER = 'over',
}
