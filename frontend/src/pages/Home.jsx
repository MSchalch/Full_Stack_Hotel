import React from 'react';
import { Users, BedDouble, CalendarCheck, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Home.css';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>{t('home.title')}</h1>
          <p>{t('home.subtitle')}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Users size={24} /></div>
          <div className="stat-info">
            <h3>124</h3>
            <p>{t('home.active_guests')}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><BedDouble size={24} /></div>
          <div className="stat-info">
            <h3>15</h3>
            <p>{t('home.free_rooms')}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><CalendarCheck size={24} /></div>
          <div className="stat-info">
            <h3>8</h3>
            <p>{t('home.checkins_today')}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><TrendingUp size={24} /></div>
          <div className="stat-info">
            <h3>R$ 4.250</h3>
            <p>{t('home.daily_revenue')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
