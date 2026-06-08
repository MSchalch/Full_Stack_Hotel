import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <button 
        onClick={() => changeLanguage('pt')} 
        style={{
          background: 'none',
          border: i18n.language === 'pt' ? '2px solid #2563eb' : '2px solid transparent',
          cursor: 'pointer',
          padding: '2px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: i18n.language === 'pt' ? 1 : 0.5,
          transition: 'all 0.2s'
        }}
        title="Português"
      >
        <img src="https://flagcdn.com/w40/br.png" alt="Português" style={{ width: '24px', borderRadius: '2px' }} />
      </button>
      
      <button 
        onClick={() => changeLanguage('en')} 
        style={{
          background: 'none',
          border: i18n.language === 'en' ? '2px solid #2563eb' : '2px solid transparent',
          cursor: 'pointer',
          padding: '2px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: i18n.language === 'en' ? 1 : 0.5,
          transition: 'all 0.2s'
        }}
        title="English"
      >
        <img src="https://flagcdn.com/w40/us.png" alt="English" style={{ width: '24px', borderRadius: '2px' }} />
      </button>
    </div>
  );
};

export default LanguageSwitcher;
