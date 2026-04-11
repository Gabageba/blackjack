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
  balance: css`
    font-size: 0.95rem;
    opacity: 0.95;
  `,
  titleContainer: css`
    display: flex;
    align-items: center;
    gap: 12px;
  `,
});

export default styles;
