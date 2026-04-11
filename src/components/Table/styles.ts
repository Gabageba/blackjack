import { css } from '@emotion/react';

const styles = () => ({
  self: css`
    box-sizing: border-box;
    flex: 1 1 auto;
    min-height: 0;
    width: 100%;
    padding: 24px 16px max(32px, env(safe-area-inset-bottom, 0px));

    @media (width <= 520px) {
      padding: 16px 10px max(24px, env(safe-area-inset-bottom, 0px));
      font-size: 1rem;
      gap: 14px;
    }

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
