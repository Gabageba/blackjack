import { type Dispatch, type SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles';

type IProps = {
  balance: number;
  setBalance: Dispatch<SetStateAction<number>>;
};

function Balance({ balance, setBalance }: IProps) {
  const { t } = useTranslation();

  return (
    <button type="button" css={styles().balanceButton} onClick={() => setBalance(1000)}>
      {t('game.balance', { value: balance })}
    </button>
  );
}

export default Balance;
