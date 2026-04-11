import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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

/** Пауза между картами при начальной раздаче (мс). */
const DEAL_STAGGER_MS = 200;

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

  const dealerDisplay = useMemo(() => {
    if (holeHidden && dealer.length >= 2) {
      return dealer.slice(0, 1);
    }
    return dealer;
  }, [dealer, holeHidden]);

  const runDealer = useCallback(
    (startDeck: CardType[], p: CardType[], startDealer: CardType[], wager: number) => {
      let d = [...startDealer];
      let rest = [...startDeck];
      while (dealerShouldHit(d) && rest.length > 0) {
        const { drawn, rest: r } = draw(rest, 1);
        d = [...d, ...drawn];
        rest = r;
      }
      setDealer(d);
      setDeck(rest);
      settle(p, d, wager);
    },
    [settle],
  );

  const stand = () => {
    if (phase !== Phase.PLAY) return;
    setHoleHidden(false);
    const w = roundWager.current;
    setPhase(Phase.OVER);
    runDealer(deck, player, dealer, w);
  };

  const clearDealTimeouts = useCallback(() => {
    for (const id of dealTimeoutsRef.current) {
      window.clearTimeout(id);
    }
    dealTimeoutsRef.current = [];
  }, []);

  const resetTable = () => {
    clearDealTimeouts();
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
      setHoleHidden(false);
      setPhase(Phase.OVER);
      settle(p, dealer, w);
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

    const queue = (fn: () => void, delayMs: number) => {
      const id = window.setTimeout(fn, delayMs);
      dealTimeoutsRef.current.push(id);
    };

    queue(() => {
      setPlayer([c0]);
    }, 0);
    queue(() => {
      setDealer([c1]);
    }, DEAL_STAGGER_MS);
    queue(() => {
      setPlayer([c0, c2]);
    }, DEAL_STAGGER_MS * 2);
    queue(() => {
      setDealer([c1, c3]);
    }, DEAL_STAGGER_MS * 3);
    queue(() => {
      const p = [c0, c2];
      const d = [c1, c3];
      const pBj = isBlackjack(p);
      const dBj = isBlackjack(d);

      if (pBj || dBj) {
        setHoleHidden(false);
        setPhase(Phase.OVER);
        settle(p, d, wager);
        return;
      }
      setPhase(Phase.PLAY);
      setMessage(t('messages.yourTurn'));
    }, DEAL_STAGGER_MS * 4);
  }, [
    balance,
    bet,
    clearDealTimeouts,
    dealer.length,
    player.length,
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

  return (
    <>
      <p css={styles().message}>{displayMessage}</p>
      {showWagerDuringPlay && (
        <p css={styles().wagerLine}>{t('game.currentWager', { value: displayedWager })}</p>
      )}

      <div css={styles().row}>
        <span css={styles().label}>
          {dealer.length > 0
            ? t('game.dealerScore', { score: dealerScoreVisible })
            : t('game.dealer')}
        </span>
        <div css={styles().cards}>
          {dealerDisplay.map((c, i) => (
            <Card key={`d-${i}-${c.suit}-${c.rank}`} card={c} dealMotion={true} />
          ))}
          {holeHidden && dealer[1] && <Card isEmpty dealMotion={true} />}
        </div>
      </div>

      <div css={styles().row}>
        <span css={styles().label}>
          {player.length > 0
            ? t('game.playerScore', { score: handValue(player) })
            : t('game.player')}
        </span>
        <div css={styles().cards}>
          {player.map((c, i) => (
            <Card key={`p-${i}-${c.suit}-${c.rank}`} card={c} dealMotion={true} />
          ))}
        </div>
      </div>

      {phase !== Phase.OVER && (
        <Buttons player={player} phase={phase} newRound={newRound} hit={hit} stand={stand} />
      )}

      {phase === Phase.OVER && (
        <div
          css={styles().overlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="round-over-title"
        >
          <div css={styles().modal}>
            <p id="round-over-title" css={styles().modalTitle}>
              {t('game.roundOver')}
            </p>
            <p css={styles().modalBody}>{message}</p>
            {netChange !== null && (
              <p
                css={[
                  styles().modalNet,
                  netChange < 0 && styles().modalNetLoss,
                  netChange === 0 && styles().modalNetEven,
                ]}
              >
                {netChange > 0
                  ? t('game.roundWon', { value: netChange })
                  : netChange < 0
                    ? t('game.roundLost', { value: Math.abs(netChange) })
                    : t('game.roundEven')}
              </p>
            )}
            <div css={styles().modalActions}>
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
