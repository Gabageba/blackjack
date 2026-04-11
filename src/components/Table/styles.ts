import { css } from '@emotion/react';

const styles = () => ({
  self: css`
    box-sizing: border-box;
    width: 100%;
    min-height: 100vh;
    min-height: 100dvh;
    padding: 24px 16px 32px;
    font-family: system-ui, sans-serif;
    font-size: 1.0625rem;
    line-height: 1.35;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  `,
});

export default styles;
