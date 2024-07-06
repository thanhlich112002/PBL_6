import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n';
import { useTranslation } from "react-i18next";
const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [selectedLang, setSelectedLang] = useState('vi');
  const { i18n } = useTranslation();
  const updateLang = (newCity) => {
    setSelectedLang(newCity);
  };
  useEffect(() => {
    i18n.changeLanguage(selectedLang);
  }, [selectedLang]);
  return (
    <LanguageContext.Provider value={{ selectedLang, updateLang}}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => {
    return useContext(LanguageContext);
  };
