import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { type Card as CardType } from '../../types/card';
import { CARD_BACK_URL, cardImageUrl } from '../../utils/cardImgUrl';
import styles from './styles';

const MAX_ROT = 14;
const HOVER_SCALE = 1.045;
const LERP = 0.22;

type IProps = {
  card?: CardType;
  isEmpty?: boolean;
  /** Вход с «полки»: раздача или новая карта игроку */
  dealMotion?: boolean;
};

function Card({ card, isEmpty, dealMotion }: IProps) {
  const { t } = useTranslation();
  const [reduceMotion, setReduceMotion] = useState(false);

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

  const onPointerEnter = useCallback(() => {
    if (reduceMotion) {
      return;
    }
    hoveringRef.current = true;
    scheduleTick();
  }, [reduceMotion, scheduleTick]);

  const onPointerLeave = useCallback(() => {
    hoveringRef.current = false;
    targetRef.current = { rx: 0, ry: 0 };
    scheduleTick();
  }, [scheduleTick]);

  const src = !isEmpty && card ? cardImageUrl(card) : CARD_BACK_URL;
  const alt = !isEmpty && card ? card.rank + ' of ' + card.suit : t('game.hiddenCard');

  const imgCss = [styles().self, dealMotion && styles().dealMotion];

  if (reduceMotion) {
    return (
      <div css={styles().tiltRoot}>
        <div css={styles().tiltInner}>
          <img css={imgCss} src={src} alt={alt} />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      css={styles().tiltRoot}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div ref={innerRef} css={styles().tiltInner}>
        <img css={imgCss} src={src} alt={alt} />
      </div>
    </div>
  );
}

export default Card;
