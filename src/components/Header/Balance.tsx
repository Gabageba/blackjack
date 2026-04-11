import { useTranslation } from 'react-i18next';
import styles from './styles';

type IProps = {
  balance: number;
};

function Balance({ balance }: IProps) {
  const { t } = useTranslation();

  return <span css={styles().balance}>{t('game.balance', { value: balance })}</span>;
}

export default Balance;
