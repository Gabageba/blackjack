import { css } from '@emotion/react';

const styles = () => ({
  btn: css`
    padding: 10px 20px;
    font-size: 0.95rem;
    font-weight: 600;
    border-radius: 8px;
    border: none;
    color: #0d1f14;
    box-shadow: 0 2px 0 rgb(0 0 0 / 25%);
    transition: transform 0.1s ease;

    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    &:hover:not(:disabled) {
      filter: brightness(1.05);
      transform: scale(1.03);
    }

    &:active:not(:disabled) {
      transform: translateY(1px);
    }
  `,

  btnDefault: css`
    background: #e8f5a0;
  `,
  btnPrimary: css`
    background: #c8e86a;
  `,
  btnMuted: css`
    background: #9cb8a8;
  `,
  btnDanger: css`
    background: #f4a4a4;
  `,
  btnOutlined: css`
    padding: 6px 10px;
    border: 1px solid rgb(255 255 255 / 25%);
    background: rgb(0 0 0 / 25%);
    color: inherit;

    &:hover:not(:disabled) {
      background: rgb(255 255 255 / 20%);
    }
  `,
});

export default styles;
