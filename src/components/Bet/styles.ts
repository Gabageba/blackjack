import { css } from '@emotion/react';

const styles = () => ({
  self: css`
    box-sizing: border-box;
    display: flex;
    flex-flow: column nowrap;
    gap: 16px;
    align-items: center;
    justify-content: center;
    padding: 28px 32px;
    border-radius: 12px;
    background: rgb(0 0 0 / 35%);
    border: 1px solid rgb(255 255 255 / 12%);
    width: 100%;
    max-width: 500px;

    @media (width <= 520px) {
      padding: 18px 14px;
      gap: 14px;
    }

    @media (width <= 360px) {
      padding: 14px 10px;
    }
  `,
  label: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 100%;

    input {
      width: 100%;
      box-sizing: border-box;
      padding: 8px 10px;
      border-radius: 6px;
      border: 1px solid rgb(255 255 255 / 25%);
      background: rgb(0 0 0 / 25%);
      color: inherit;
      text-align: center;
    }
  `,
  btns: css`
    display: grid;
    width: 100%;
    gap: 8px;
    grid-template-columns: repeat(2, minmax(0, 1fr));

    /* <380px: same denomination + / − on one row (+25 next to −25) */
    @media (width <= 379.98px) {
      > button:nth-of-type(1) {
        grid-column: 1;
        grid-row: 1;
      }

      > button:nth-of-type(4) {
        grid-column: 2;
        grid-row: 1;
      }

      > button:nth-of-type(2) {
        grid-column: 1;
        grid-row: 2;
      }

      > button:nth-of-type(5) {
        grid-column: 2;
        grid-row: 2;
      }

      > button:nth-of-type(3) {
        grid-column: 1;
        grid-row: 3;
      }

      > button:nth-of-type(6) {
        grid-column: 2;
        grid-row: 3;
      }
    }

    @media (width >= 380px) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 9px;

      > button {
        grid-column: auto;
        grid-row: auto;
      }
    }

    @media (width >= 520px) {
      grid-template-columns: repeat(6, minmax(0, 1fr));
      gap: 10px;
    }

    button {
      min-width: 0;
      width: 100%;
      padding-inline: 6px;
      font-size: 0.85rem;

      @media (width >= 380px) {
        font-size: 0.88rem;
      }

      @media (width >= 520px) {
        padding-inline: 10px;
        font-size: 0.95rem;
      }
    }
  `,
  confirm: css`
    width: 100%;

    button {
      width: 100%;
    }
  `,
});

export default styles;
