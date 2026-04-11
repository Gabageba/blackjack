import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles';
import Button from '../Button/index.tsx.tsx';

interface BetProps {
  bet: number;
  setBet: (bet: number) => void;
  balance: number;
  onConfirm: () => void;
}

const MIN_BET = 0;
const MAX_BET = 500;

function clampBet(n: number): number {
  return Math.max(MIN_BET, Math.min(MAX_BET, n));
}

function Bet({ bet, setBet, balance, onConfirm }: BetProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState(() => String(bet));

  useEffect(() => {
    setDraft(String(bet));
  }, [bet]);

  const parseDraft = (): number | null => {
    const trimmed = draft.trim();
    if (trimmed === '') {
      return null;
    }
    const n = Number.parseInt(trimmed, 10);
    if (Number.isNaN(n)) {
      return null;
    }
    return clampBet(n);
  };

  const commitDraft = () => {
    const n = parseDraft();
    if (n !== null) {
      setBet(n);
      setDraft(String(n));
    } else {
      setDraft(String(bet));
    }
  };

  const parsed = parseDraft();
  const wager = parsed !== null ? Math.max(MIN_BET, Math.min(parsed, balance)) : null;
  const canConfirm = balance >= 1 && wager !== null && wager >= MIN_BET;

  const handleConfirm = () => {
    const n = parseDraft();
    if (n === null) {
      return;
    }
    const clamped = Math.max(MIN_BET, Math.min(n, balance));
    setBet(clamped);
    onConfirm();
  };

  const increaseBet = (amount: number) => {
    if (bet + amount > MAX_BET) {
      setBet(MAX_BET);
      return;
    }

    if (bet + amount > balance) {
      setBet(balance);
      return;
    }

    setBet(bet + amount);
  };

  const decreaseBet = (amount: number) => {
    if (bet - amount < MIN_BET) {
      setBet(MIN_BET);
      return;
    }

    setBet(bet - amount);
  };

  return (
    <div css={styles().self}>
      <label css={styles().label}>
        {t('game.bet')}
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitDraft}
        />
      </label>
      <div css={styles().btns}>
        <Button type="outlined" onClick={() => increaseBet(25)}>
          + 25
        </Button>
        <Button type="outlined" onClick={() => increaseBet(50)}>
          + 50
        </Button>
        <Button type="outlined" onClick={() => increaseBet(100)}>
          + 100
        </Button>
        <Button type="outlined" onClick={() => decreaseBet(25)}>
          - 25
        </Button>
        <Button type="outlined" onClick={() => decreaseBet(50)}>
          - 50
        </Button>
        <Button type="outlined" onClick={() => decreaseBet(100)}>
          - 100
        </Button>
      </div>
      <div css={styles().confirm}>
        <Button type="primary" disabled={!canConfirm || bet === 0} onClick={handleConfirm}>
          {t('game.betConfirm')}
        </Button>
      </div>
    </div>
  );
}

export default Bet;
