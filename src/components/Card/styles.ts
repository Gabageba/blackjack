import { css, keyframes } from '@emotion/react';

const cardDealPop = keyframes`
  from {
    opacity: 0;
    transform: translateY(-44px) scale(0.88) rotate(-3deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1) rotate(0deg);
  }
`;

const styles = () => ({
  tiltRoot: css`
    display: inline-flex;
    perspective: 520px;
    transform-style: preserve-3d;
  `,
  tiltInner: css`
    transform-style: preserve-3d;
    border-radius: 6px;
    will-change: transform;
    box-shadow:
      0 4px 12px rgb(0 0 0 / 45%),
      0 0 0 1px rgb(255 255 255 / 8%);
  `,
  self: css`
    display: block;
    width: 118px;
    height: auto;
    border-radius: 6px;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
  `,
  dealMotion: css`
    animation: ${cardDealPop} 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
  `,
});

export default styles;
