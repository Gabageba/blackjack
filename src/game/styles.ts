import { css } from '@emotion/react';

const styles = () => ({
  self: css`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    min-height: 100dvh;
    width: 100%;
    background: radial-gradient(
      ellipse 135vw 120vh at 50% 40%,
      #1a5f3a 0%,
      #0d2818 68%,
      #07140d 100%
    );
    color: #f5f0e6;
  `,
});

export default styles;
