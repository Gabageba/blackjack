import { useTranslation } from 'react-i18next';
import styles from './styles';
import Balance from './Balance';
import Language from './Language';

type IProps = {
  balance: number;
};

function Header({ balance }: IProps) {
  const { t } = useTranslation();

  return (
    <div css={styles().self}>
      <div css={styles().titleContainer}>
        <h1 css={styles().title}>{t('game.title')}</h1>
        <Language />
      </div>
      <Balance balance={balance} />
    </div>
  );
}

export default Header;
