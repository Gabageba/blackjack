import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { css } from '@emotion/react';
import { type Card as CardType } from '../../types/card';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import Buttons from '@components/Buttons';
import { Phase } from '../../types/phase';
import dealerShouldHit from '../../utils/dealerShouldHit';
import handValue from '../../utils/handValue';
import isBlackjack from '../../utils/isBlackjack';
import Card from '@components/Card';
import Button from '../Button/index.tsx.tsx';
import isBust from '../../utils/isBust';
import { shuffle } from '../../utils/shuffle';
import { createDeck } from '../../utils/createDeck';
import {
  CARD_DEAL_ANIM_MS,
  CARD_FLIP_MS,
  DEAL_STAGGER_MS,
  HOLE_REVEAL_MODAL_DELAY_MS,
  INITIAL_DEAL_FINISH_MS,
} from '../../utils/cardMotion';
import { cardWidthForSingleRow } from '../../utils/handCardLayout';

type IProps = {
  balance: number;
  phase: Phase;
  setPhase: (phase: Phase) => void;
  setBalance: Dispatch<SetStateAction<number>>;
  bet: number;
  dealNonce: number;
  bumpDealNonce: () => void;
};

const draw = (deck: CardType[], n: number): { drawn: CardType[]; rest: CardType[] } => {
  return { drawn: deck.slice(0, n), rest: deck.slice(n) };
};

function HandCardsRow({
  cardWidth,
  isEmpty,
  children,
}: {
  cardWidth: number;
  isEmpty: boolean;
  children: ReactNode;
}) {
  const s = styles();
  return (
    <div
      css={[
        s.cards,
        isEmpty && s.cardsEmpty,
        css`
          --card-width: ${cardWidth}px;
        `,
      ]}
    >
      {children}
    </div>
  );
}

const drawFour = (
  deck: CardType[],
): { c0: CardType; c1: CardType; c2: CardType; c3: CardType; rest: CardType[] } | null => {
  const { drawn, rest } = draw(deck, 4);
  const [c0, c1, c2, c3] = drawn;
  if (!c0 || !c1 || !c2 || !c3) {
    return null;
  }
  return { c0, c1, c2, c3, rest };
};

function Hands({ balance, phase, setPhase, setBalance, bet, dealNonce, bumpDealNonce }: IProps) {
  const { t } = useTranslation();
  const roundWager = useRef(0);
  const lastAutoDealNonce = useRef(-1);
  const dealTimeoutsRef = useRef<number[]>([]);

  const [dealer, setDealer] = useState<CardType[]>([]);
  const [player, setPlayer] = useState<CardType[]>([]);
  const [deck, setDeck] = useState<CardType[]>([]);
  const [message, setMessage] = useState('');
  const [holeHidden, setHoleHidden] = useState(false);
  /** Фактическая ставка текущего раунда (после списания). */
  const [displayedWager, setDisplayedWager] = useState(0);
  /** Изменение баланса за раунд относительно состояния после списания ставки. */
  const [netChange, setNetChange] = useState<number | null>(null);
  /** Модалка итога раунда — только после анимаций карт. */
  const [showRoundOverModal, setShowRoundOverModal] = useState(false);

  const settle = useCallback(
    (p: CardType[], d: CardType[], wager: number) => {
      const pv = handValue(p);
      const dv = handValue(d);
      const pBj = isBlackjack(p);
      const dBj = isBlackjack(d);

      if (pBj && dBj) {
        setBalance((b) => b + wager);
        setNetChange(0);
        setMessage(t('messages.bothBlackjackPush'));
        return;
      }
      if (pBj) {
        setBalance((b) => b + Math.floor(wager * 2.5));
        setNetChange(Math.floor(wager * 2.5) - wager);
        setMessage(t('messages.playerBlackjack'));
        return;
      }
      if (dBj) {
        setNetChange(-wager);
        setMessage(t('messages.dealerBlackjack'));
        return;
      }
      if (pv > 21) {
        setNetChange(-wager);
        setMessage(t('messages.playerBust'));
        return;
      }
      if (dv > 21) {
        setBalance((b) => b + wager * 2);
        setNetChange(wager);
        setMessage(t('messages.dealerBust'));
        return;
      }
      if (pv > dv) {
        setBalance((b) => b + wager * 2);
        setNetChange(wager);
        setMessage(t('messages.playerWin'));
        return;
      }
      if (pv < dv) {
        setNetChange(-wager);
        setMessage(t('messages.dealerWin'));
        return;
      }
      setBalance((b) => b + wager);
      setNetChange(0);
      setMessage(t('messages.push'));
    },
    [t, setBalance],
  );

  const clearDealTimeouts = useCallback(() => {
    for (const id of dealTimeoutsRef.current) {
      window.clearTimeout(id);
    }
    dealTimeoutsRef.current = [];
  }, []);

  const scheduleDealTimeout = useCallback((fn: () => void, delayMs: number) => {
    const id = window.setTimeout(fn, delayMs);
    dealTimeoutsRef.current.push(id);
  }, []);

  /** Дилер добирает карты по одной; затем расчёт и показ модалки. */
  const runDealerAnimated = useCallback(
    (startDeck: CardType[], p: CardType[], startDealer: CardType[], wager: number) => {
      clearDealTimeouts();
      let simD = [...startDealer];
      let simRest = [...startDeck];
      const toDraw: CardType[] = [];
      while (dealerShouldHit(simD) && simRest.length > 0) {
        const { drawn, rest: r } = draw(simRest, 1);
        simD = [...simD, ...drawn];
        simRest = r;
        toDraw.push(drawn[0]);
      }

      if (toDraw.length === 0) {
        scheduleDealTimeout(() => {
          settle(p, simD, wager);
          setShowRoundOverModal(true);
        }, CARD_FLIP_MS);
        return;
      }

      let delay = CARD_FLIP_MS;
      let accD = [...startDealer];
      let accRest = [...startDeck];

      for (let i = 0; i < toDraw.length; i++) {
        const stepIndex = i;
        scheduleDealTimeout(() => {
          const { drawn, rest: r } = draw(accRest, 1);
          accD = [...accD, ...drawn];
          accRest = r;
          setDealer(accD);
          setDeck(accRest);
          if (stepIndex === toDraw.length - 1) {
            scheduleDealTimeout(() => {
              settle(p, simD, wager);
              setShowRoundOverModal(true);
            }, CARD_DEAL_ANIM_MS);
          }
        }, delay);
        delay += DEAL_STAGGER_MS;
      }
    },
    [clearDealTimeouts, scheduleDealTimeout, settle],
  );

  const stand = () => {
    if (phase !== Phase.PLAY) return;
    setShowRoundOverModal(false);
    setHoleHidden(false);
    const w = roundWager.current;
    setPhase(Phase.OVER);
    runDealerAnimated(deck, player, dealer, w);
  };

  const resetTable = () => {
    clearDealTimeouts();
    setShowRoundOverModal(false);
    setPlayer([]);
    setDealer([]);
    setDeck([]);
    setHoleHidden(false);
    setMessage('');
  };

  const newRound = () => {
    resetTable();
    setPhase(Phase.BET_CHOICE);
  };

  const endSameBetAgain = () => {
    resetTable();
    bumpDealNonce();
    setPhase(Phase.DEAL_READY);
  };

  const hit = () => {
    if (phase !== Phase.PLAY || deck.length === 0) return;
    const { drawn, rest } = draw(deck, 1);
    const p = [...player, ...drawn];
    setPlayer(p);
    setDeck(rest);
    const w = roundWager.current;

    if (isBust(p)) {
      clearDealTimeouts();
      setShowRoundOverModal(false);
      setHoleHidden(false);
      setPhase(Phase.OVER);
      settle(p, dealer, w);
      scheduleDealTimeout(() => setShowRoundOverModal(true), HOLE_REVEAL_MODAL_DELAY_MS);
      return;
    }
    if (handValue(p) === 21) {
      setShowRoundOverModal(false);
      setHoleHidden(false);
      setPhase(Phase.OVER);
      runDealerAnimated(rest, p, dealer, w);
    }
  };

  const dealerScoreVisible = useMemo(() => {
    if (holeHidden && dealer[0]) {
      return handValue([dealer[0]]);
    }
    return handValue(dealer);
  }, [dealer, holeHidden]);

  const displayMessage = message;

  const deal = useCallback(() => {
    if (player.length > 0 || dealer.length > 0) {
      return;
    }

    const wager = Math.max(1, Math.min(bet, balance));
    if (balance < wager) {
      setMessage(t('messages.insufficientChips'));
      return;
    }

    const shuffled = shuffle(createDeck());
    const drawn4 = drawFour(shuffled);
    if (!drawn4) {
      return;
    }
    const { c0, c1, c2, c3, rest } = drawn4;

    roundWager.current = wager;
    setDisplayedWager(wager);
    setNetChange(null);
    setBalance((b) => b - wager);
    setDeck(rest);
    setHoleHidden(true);
    setPlayer([]);
    setDealer([]);

    clearDealTimeouts();
    setShowRoundOverModal(false);

    scheduleDealTimeout(() => {
      setPlayer([c0]);
    }, 0);
    scheduleDealTimeout(() => {
      setDealer([c1]);
    }, DEAL_STAGGER_MS);
    scheduleDealTimeout(() => {
      setPlayer([c0, c2]);
    }, DEAL_STAGGER_MS * 2);
    scheduleDealTimeout(() => {
      setDealer([c1, c3]);
    }, DEAL_STAGGER_MS * 3);
    scheduleDealTimeout(() => {
      const p = [c0, c2];
      const d = [c1, c3];
      const pBj = isBlackjack(p);
      const dBj = isBlackjack(d);

      if (pBj || dBj) {
        setHoleHidden(false);
        setPhase(Phase.OVER);
        settle(p, d, wager);
        scheduleDealTimeout(() => setShowRoundOverModal(true), CARD_FLIP_MS);
        return;
      }
      setPhase(Phase.PLAY);
      setMessage(t('messages.yourTurn'));
    }, INITIAL_DEAL_FINISH_MS);
  }, [
    balance,
    bet,
    clearDealTimeouts,
    dealer.length,
    player.length,
    scheduleDealTimeout,
    setBalance,
    setPhase,
    settle,
    t,
  ]);

  useEffect(() => {
    if (phase !== Phase.DEAL_READY) {
      return;
    }
    if (player.length > 0 || dealer.length > 0) {
      return;
    }
    if (lastAutoDealNonce.current === dealNonce) {
      return;
    }
    lastAutoDealNonce.current = dealNonce;
    queueMicrotask(() => {
      deal();
    });
  }, [dealNonce, phase, deal, player.length, dealer.length]);

  useEffect(() => {
    return () => {
      clearDealTimeouts();
    };
  }, [clearDealTimeouts]);

  const showWagerDuringPlay =
    displayedWager > 0 && (phase === Phase.DEAL_READY || phase === Phase.PLAY);

  const handsLayoutRef = useRef<HTMLDivElement>(null);
  const [sharedCardWidth, setSharedCardWidth] = useState(118);

  useLayoutEffect(() => {
    const el = handsLayoutRef.current;
    if (!el) {
      return;
    }
    const measure = () => {
      const n = Math.max(dealer.length, player.length, 1);
      setSharedCardWidth(cardWidthForSingleRow(el.clientWidth, n));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [dealer.length, player.length]);

  const s = styles();

  return (
    <>
      <p css={s.message}>{displayMessage}</p>
      {showWagerDuringPlay && (
        <p css={s.wagerLine}>{t('game.currentWager', { value: displayedWager })}</p>
      )}

      <div ref={handsLayoutRef} css={s.handsLayout}>
        <div css={s.row}>
          <span css={s.label}>
            {dealer.length > 0
              ? t('game.dealerScore', { score: dealerScoreVisible })
              : t('game.dealer')}
          </span>
          <HandCardsRow cardWidth={sharedCardWidth} isEmpty={dealer.length === 0}>
            {dealer.map((c, i) => (
              <Card
                key={`d-${i}-${c.suit}-${c.rank}`}
                card={c}
                faceDown={i === 1 ? holeHidden : undefined}
                dealMotion={true}
              />
            ))}
          </HandCardsRow>
        </div>

        <div css={s.row}>
          <span css={s.label}>
            {player.length > 0
              ? t('game.playerScore', { score: handValue(player) })
              : t('game.player')}
          </span>
          <HandCardsRow cardWidth={sharedCardWidth} isEmpty={player.length === 0}>
            {player.map((c, i) => (
              <Card key={`p-${i}-${c.suit}-${c.rank}`} card={c} dealMotion={true} />
            ))}
          </HandCardsRow>
        </div>
      </div>

      {phase !== Phase.OVER && (
        <Buttons player={player} phase={phase} newRound={newRound} hit={hit} stand={stand} />
      )}

      {phase === Phase.OVER && showRoundOverModal && (
        <div css={s.overlay} role="dialog" aria-modal="true" aria-labelledby="round-over-title">
          <div css={s.modal}>
            <p id="round-over-title" css={s.modalTitle}>
              {t('game.roundOver')}
            </p>
            <p css={s.modalBody}>{message}</p>
            {netChange !== null && (
              <p
                css={[
                  s.modalNet,
                  netChange < 0 && s.modalNetLoss,
                  netChange === 0 && s.modalNetEven,
                ]}
              >
                {netChange > 0
                  ? t('game.roundWon', { value: netChange })
                  : netChange < 0
                    ? t('game.roundLost', { value: Math.abs(netChange) })
                    : t('game.roundEven')}
              </p>
            )}
            <div css={s.modalActions}>
              <Button type="primary" onClick={endSameBetAgain}>
                {t('game.sameBetAgain')}
              </Button>
              <Button type="default" onClick={newRound}>
                {t('game.changeBet')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Hands;
