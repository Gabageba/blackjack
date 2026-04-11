import { type Dispatch, type SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles';
import Balance from './Balance';
import Language from './Language';

type IProps = {
  balance: number;
  setBalance: Dispatch<SetStateAction<number>>;
};

function Header({ balance, setBalance }: IProps) {
  const { t } = useTranslation();

  return (
    <div css={styles().self}>
      <div css={styles().titleContainer}>
        <h1 css={styles().title}>{t('game.title')}</h1>
        <Language />
      </div>
      <Balance balance={balance} setBalance={setBalance} />
    </div>
  );
}

export default Header;
