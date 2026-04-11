import { useTranslation } from 'react-i18next';
import styles from './styles';
import Button from '../Button/index.tsx.tsx';
import { Phase } from '../../types/phase.ts';
import { type Card } from '../../types/card.ts';
import isBust from '../../utils/isBust.ts';

type IProps = {
  player: Card[];
  phase: Phase;
  newRound: () => void;
  hit: () => void;
  stand: () => void;
};

function Buttons({ player, phase, newRound, hit, stand }: IProps) {
  const { t } = useTranslation();

  const canHit = phase === Phase.PLAY && !isBust(player);
  const canStand = phase === Phase.PLAY && !isBust(player);

  return (
    <div css={styles().self}>
      <div css={styles().actions}>
        <Button type="danger" disabled={!canStand} onClick={stand}>
          {t('game.stand')}
        </Button>
        <Button type="primary" disabled={!canHit} onClick={hit}>
          {t('game.hit')}
        </Button>
      </div>
      <Button type="muted" onClick={newRound}>
        {t('game.backToBet')}
      </Button>
    </div>
  );
}

export default Buttons;
