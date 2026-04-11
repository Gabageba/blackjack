const LANGUAGE_KEY = 'blackjack-language';

export enum Language {
  EN = 'en',
  RU = 'ru',
}

export const getLanguageLabelByKey = (language: Language) => {
  switch (language) {
    case Language.EN:
      return 'EN';
    case Language.RU:
      return 'РУС';
  }
};

export const getLanguageFromLocalStorage = () => {
  const language = window.localStorage.getItem(LANGUAGE_KEY);

  if (typeof language === 'string') {
    return language as Language;
  }

  setLanguageToLocalStorage(Language.RU);
  return Language.RU;
};

export const setLanguageToLocalStorage = (language: Language) =>
  window.localStorage.setItem(LANGUAGE_KEY, language);
