import { useState } from 'react';
import {
  getLanguageFromLocalStorage,
  getLanguageLabelByKey,
  Language as LanguageEnum,
  setLanguageToLocalStorage,
} from '../../utils/language';
import { useTranslation } from 'react-i18next';
import Button from '@components/Button/index.tsx';

function Language() {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState<LanguageEnum>(getLanguageFromLocalStorage());

  return (
    <Button
      type="outlined"
      onClick={() => {
        const newLang = lang === LanguageEnum.EN ? LanguageEnum.RU : LanguageEnum.EN;
        setLang(newLang);
        setLanguageToLocalStorage(newLang);
        void i18n.changeLanguage(newLang);
      }}
    >
      {getLanguageLabelByKey(lang)}
    </Button>
  );
}

export default Language;
