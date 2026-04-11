import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Header from '../components/Header';
import styles from './styles';
import Table from '@components/Table';
import { readStoredBalance, writeStoredBalance } from '../utils/balance';

function baseLanguage(code: string): string {
  const [base] = code.split('-');
  return base ?? code;
}

const Game = () => {
  const { t, i18n } = useTranslation();
  const [balance, setBalance] = useState(() => readStoredBalance());

  useEffect(() => {
    document.title = t('meta.title');
    document.documentElement.lang = baseLanguage(i18n.language);
  }, [t, i18n.language]);

  useEffect(() => {
    writeStoredBalance(balance);
  }, [balance]);

  return (
    <div css={styles().self}>
      <Header balance={balance} setBalance={setBalance} />
      <Table balance={balance} setBalance={setBalance} />
    </div>
  );
};

export default Game;
