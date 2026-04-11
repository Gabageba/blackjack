import { css } from '@emotion/react';

const styles = () => ({
  self: css`
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    background-color: transparent;
    border-bottom: 1px solid #fff;
    justify-content: space-between;
  `,
  title: css`
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    opacity: 0.92;
  `,
  balanceButton: css`
    margin: 0;
    padding: 0;
    border: none;
    background: none;
    color: inherit;
    font: inherit;
    font-size: 0.95rem;
    font-weight: 600;
    opacity: 0.95;
    cursor: pointer;
    text-align: inherit;

    &:hover {
      opacity: 1;
    }
  `,
  titleContainer: css`
    display: flex;
    align-items: center;
    gap: 12px;
  `,
});

export default styles;
