import { css } from '@emotion/react';

import { HAND_CARD_GAP_PX } from '../../utils/handCardLayout';

const styles = () => ({
  /** Общая ширина для расчёта масштаба карт у дилера и игрока */
  handsLayout: css`
    align-self: stretch;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 20px;

    @media (width <= 520px) {
      gap: 14px;
    }
  `,
  row: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  `,
  label: css`
    font-size: 1.05rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    opacity: 0.75;
  `,
  message: css`
    min-height: 1.55em;
    font-size: 1.28rem;
    font-weight: 500;
    text-align: center;
    max-width: 520px;
    line-height: 1.35;
  `,
  wagerLine: css`
    font-size: 1.02rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-align: center;
    color: rgb(220 245 210 / 95%);
    margin-top: -4px;
  `,
  cards: css`
    display: flex;
    flex-flow: row nowrap;
    gap: ${HAND_CARD_GAP_PX}px;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    min-height: calc(var(--card-width, 118px) * 7 / 5);
  `,
  cardsEmpty: css`
    min-height: 0;
  `,
  overlay: css`
    position: fixed;
    inset: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: rgb(0 0 0 / 55%);
  `,
  modal: css`
    width: 100%;
    max-width: 380px;
    padding: 24px 22px 22px;
    border-radius: 14px;
    background: linear-gradient(165deg, #2a3d32 0%, #152018 100%);
    border: 1px solid rgb(255 255 255 / 14%);
    box-shadow:
      0 16px 48px rgb(0 0 0 / 55%),
      inset 0 1px 0 rgb(255 255 255 / 6%);
    color: #f5f0e6;
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  `,
  modalTitle: css`
    font-size: 1.28rem;
    font-weight: 600;
    text-align: center;
    letter-spacing: 0.04em;
  `,
  modalBody: css`
    font-size: 1.12rem;
    line-height: 1.45;
    text-align: center;
    opacity: 0.95;
  `,
  modalNet: css`
    font-size: 1.18rem;
    font-weight: 600;
    text-align: center;
    letter-spacing: 0.03em;
    color: rgb(190 255 200 / 98%);
  `,
  modalNetLoss: css`
    color: rgb(255 190 175 / 96%);
  `,
  modalNetEven: css`
    color: rgb(230 225 210 / 88%);
    font-weight: 500;
  `,
  modalActions: css`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 4px;
  `,
});

export default styles;
