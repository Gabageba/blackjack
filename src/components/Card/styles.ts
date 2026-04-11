import { css, keyframes } from '@emotion/react';
import { colors } from '../../styles/theme';
import { CARD_DEAL_ANIM_MS, CARD_FLIP_MS } from '../../utils/cardMotion';

const dealDuration = `${CARD_DEAL_ANIM_MS / 1000}s`;
const flipDuration = `${CARD_FLIP_MS / 1000}s`;

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

const toastEnter = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
`;

const styles = () => ({
  tiltRoot: css`
    display: inline-flex;
    flex: 0 0 auto;
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
    width: var(--card-width, 118px);
    aspect-ratio: 5 / 7;
    object-fit: contain;
    object-position: center;
    border-radius: 6px;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
  `,
  dealMotion: css`
    animation: ${cardDealPop} ${dealDuration} cubic-bezier(0.22, 1, 0.36, 1) both;
  `,
  flipTrack: css`
    width: var(--card-width, 118px);
    perspective: 760px;
    position: relative;
  `,
  flipPivot: css`
    position: relative;
    width: 100%;
    aspect-ratio: 5 / 7;
    transform-style: preserve-3d;
    transition: transform ${flipDuration} cubic-bezier(0.34, 1.2, 0.64, 1);
    transform: rotateY(0deg);
  `,
  flipPivotRevealed: css`
    transform: rotateY(180deg);
  `,
  flipPivotReduced: css`
    transition: none;
  `,
  flipFace: css`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 6px;
    transform-style: preserve-3d;
    box-shadow:
      0 4px 12px rgb(0 0 0 / 45%),
      0 0 0 1px rgb(255 255 255 / 8%);

    & > img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 6px;
      image-rendering: pixelated;
      image-rendering: crisp-edges;
    }
  `,
  flipFaceFront: css`
    transform: rotateY(180deg);
  `,
  tooltip: css`
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: calc(20px + env(safe-area-inset-bottom, 0px));
    z-index: 10050;
    box-sizing: border-box;
    min-width: 260px;
    max-width: min(420px, calc(100vw - 32px));
    width: max-content;
    padding: 12px 18px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    text-align: center;
    white-space: normal;
    color: ${colors.white};
    background: rgb(18 20 26 / 96%);
    border: 1px solid rgb(255 255 255 / 12%);
    box-shadow:
      0 0 0 1px rgb(0 0 0 / 35%),
      0 12px 40px rgb(0 0 0 / 55%);
    pointer-events: none;
    animation: ${toastEnter} 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  `,
});

export default styles;
