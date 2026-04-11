import { css } from '@emotion/react';

const styles = () => ({
  self: css`
    display: flex;
    flex-flow: column nowrap;
    gap: 16px;
    align-items: center;
    justify-content: center;
    padding: 28px 32px;
    border-radius: 12px;
    background: rgb(0 0 0 / 35%);
    border: 1px solid rgb(255 255 255 / 12%);
    max-width: 400px;
  `,
  label: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 100%;

    input {
      width: 100%;
      padding: 8px 10px;
      border-radius: 6px;
      border: 1px solid rgb(255 255 255 / 25%);
      background: rgb(0 0 0 / 25%);
      color: inherit;
      text-align: center;
    }
  `,
  btns: css`
    display: flex;
    gap: 10px;
  `,
});

export default styles;
