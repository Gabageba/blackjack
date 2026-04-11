import styles from './styles';
import { type Dispatch, type SetStateAction, useCallback, useEffect, useState } from 'react';
import { Phase } from '../../types/phase';
import Bet from '@components/Bet';
import Hands from '@components/Hands';
import { readStoredBet, writeStoredBet } from '../../utils/balance';

type IProps = {
  balance: number;
  setBalance: Dispatch<SetStateAction<number>>;
};

function Table({ balance, setBalance }: IProps) {
  const [bet, setBet] = useState(() => readStoredBet());
  const [phase, setPhase] = useState<Phase>(Phase.BET_CHOICE);
  const [dealNonce, setDealNonce] = useState(0);

  const bumpDealNonce = useCallback(() => {
    setDealNonce((n) => n + 1);
  }, []);

  useEffect(() => {
    writeStoredBet(bet);
  }, [bet]);

  return (
    <div css={styles().self}>
      {phase === Phase.BET_CHOICE && (
        <Bet
          bet={bet}
          setBet={setBet}
          balance={balance}
          onConfirm={() => {
            bumpDealNonce();
            setPhase(Phase.DEAL_READY);
          }}
        />
      )}
      {phase !== Phase.BET_CHOICE && (
        <Hands
          balance={balance}
          phase={phase}
          setPhase={setPhase}
          setBalance={setBalance}
          bet={bet}
          dealNonce={dealNonce}
          bumpDealNonce={bumpDealNonce}
        />
      )}
    </div>
  );
}

export default Table;
