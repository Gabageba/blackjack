import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { type Card as CardType } from '../../types/card';
import { CARD_BACK_URL, cardImageUrl } from '../../utils/cardImgUrl';
import { cardBlackjackTooltip } from '../../utils/cardTooltip';
import styles from './styles';

const MAX_ROT = 14;
const HOVER_SCALE = 1.045;
const LERP = 0.22;

type IProps = {
  card?: CardType;
  /** Вторая карта дилера: `true` — рубашка, `false` — открыта (переворот 3D). Без пропа — обычная карта. */
  faceDown?: boolean;
  /** Вход с «полки»: раздача или новая карта игроку */
  dealMotion?: boolean;
};

function Card({ card, faceDown, dealMotion }: IProps) {
  const { t } = useTranslation();
  const tooltipId = useId();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const flipMode = card !== undefined && faceDown !== undefined;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ rx: 0, ry: 0 });
  const currentRef = useRef({ rx: 0, ry: 0 });
  const hoveringRef = useRef(false);
  const rafRef = useRef<number | undefined>(undefined);

  const applyTransform = useCallback(() => {
    const inner = innerRef.current;
    if (!inner) {
      return;
    }
    const { rx, ry } = currentRef.current;
    const s = hoveringRef.current ? HOVER_SCALE : 1;
    const lift = hoveringRef.current ? 10 : 0;
    inner.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(${lift}px) scale3d(${s}, ${s}, 1)`;
  }, []);

  const runFrameRef = useRef<() => void>(() => {});

  useLayoutEffect(() => {
    runFrameRef.current = () => {
      rafRef.current = undefined;
      const cur = currentRef.current;
      const tgt = targetRef.current;
      cur.rx += (tgt.rx - cur.rx) * LERP;
      cur.ry += (tgt.ry - cur.ry) * LERP;

      const converged = Math.abs(tgt.rx - cur.rx) < 0.05 && Math.abs(tgt.ry - cur.ry) < 0.05;

      if (converged) {
        cur.rx = tgt.rx;
        cur.ry = tgt.ry;
      }

      applyTransform();

      if (!converged) {
        rafRef.current = requestAnimationFrame(() => {
          runFrameRef.current();
        });
      }
    };
  }, [applyTransform]);

  const scheduleTick = useCallback(() => {
    if (rafRef.current === undefined) {
      rafRef.current = requestAnimationFrame(() => {
        runFrameRef.current();
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current !== undefined) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const root = rootRef.current;
      if (!root || reduceMotion) {
        return;
      }
      const rect = root.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      const clampedX = Math.max(-1, Math.min(1, nx));
      const clampedY = Math.max(-1, Math.min(1, ny));
      targetRef.current = {
        rx: -clampedY * MAX_ROT,
        ry: clampedX * MAX_ROT,
      };
      scheduleTick();
    },
    [reduceMotion, scheduleTick],
  );

  const clearTooltipTimer = useCallback(() => {
    if (tooltipTimerRef.current !== undefined) {
      window.clearTimeout(tooltipTimerRef.current);
      tooltipTimerRef.current = undefined;
    }
  }, []);

  useEffect(() => {
    return () => clearTooltipTimer();
  }, [clearTooltipTimer]);

  const tooltipText = useMemo(
    () => (card && faceDown !== true ? cardBlackjackTooltip(card, t) : undefined),
    [card, faceDown, t],
  );

  const onRootPointerEnter = useCallback(() => {
    if (!reduceMotion) {
      hoveringRef.current = true;
      scheduleTick();
    }
    if (!tooltipText) {
      return;
    }
    clearTooltipTimer();
    tooltipTimerRef.current = window.setTimeout(() => {
      tooltipTimerRef.current = undefined;
      setTooltipOpen(true);
    }, 140);
  }, [clearTooltipTimer, reduceMotion, scheduleTick, tooltipText]);

  const onRootPointerLeave = useCallback(() => {
    if (!reduceMotion) {
      hoveringRef.current = false;
      targetRef.current = { rx: 0, ry: 0 };
      scheduleTick();
    }
    clearTooltipTimer();
    setTooltipOpen(false);
  }, [clearTooltipTimer, reduceMotion, scheduleTick]);

  const s = styles();
  const imgCss = [s.self, dealMotion && !flipMode && s.dealMotion];
  const holeRevealed = flipMode && faceDown === false;
  const backAlt = t('game.hiddenCard');
  const frontAlt = card ? `${card.rank} of ${card.suit}` : '';

  const tooltipPortal =
    typeof document !== 'undefined' &&
    tooltipOpen &&
    tooltipText &&
    createPortal(
      <div id={tooltipId} css={s.tooltip} role="tooltip">
        {tooltipText}
      </div>,
      document.body,
    );

  if (flipMode && card) {
    return (
      <div
        ref={rootRef}
        css={s.tiltRoot}
        onPointerEnter={onRootPointerEnter}
        onPointerMove={reduceMotion ? undefined : onPointerMove}
        onPointerLeave={onRootPointerLeave}
      >
        <div ref={innerRef} css={s.tiltInner}>
          <div css={[s.flipTrack, dealMotion && s.dealMotion]}>
            <div
              css={[
                s.flipPivot,
                holeRevealed && s.flipPivotRevealed,
                reduceMotion && s.flipPivotReduced,
              ]}
            >
              <div css={s.flipFace}>
                <img src={CARD_BACK_URL} alt={backAlt} draggable={false} />
              </div>
              <div css={[s.flipFace, s.flipFaceFront]}>
                <img
                  src={cardImageUrl(card)}
                  alt={frontAlt}
                  draggable={false}
                  aria-describedby={tooltipOpen && tooltipText ? tooltipId : undefined}
                />
              </div>
            </div>
          </div>
        </div>
        {tooltipPortal}
      </div>
    );
  }

  const src = card ? cardImageUrl(card) : CARD_BACK_URL;
  const alt = card ? `${card.rank} of ${card.suit}` : t('game.hiddenCard');

  return (
    <div
      ref={rootRef}
      css={s.tiltRoot}
      onPointerEnter={onRootPointerEnter}
      onPointerMove={reduceMotion ? undefined : onPointerMove}
      onPointerLeave={onRootPointerLeave}
    >
      <div ref={innerRef} css={s.tiltInner}>
        <img
          css={imgCss}
          src={src}
          alt={alt}
          draggable={false}
          aria-describedby={tooltipOpen && tooltipText ? tooltipId : undefined}
        />
      </div>
      {tooltipPortal}
    </div>
  );
}

export default Card;
