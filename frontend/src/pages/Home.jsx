import React from 'react';
import { Users, BedDouble, CalendarCheck, TrendingUp } from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Dashboard Geral</h1>
          <p>Bem-vindo ao painel do Hotel do Casarão</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Users size={24} /></div>
          <div className="stat-info">
            <h3>124</h3>
            <p>Hóspedes Ativos</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><BedDouble size={24} /></div>
          <div className="stat-info">
            <h3>15</h3>
            <p>Quartos Livres</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><CalendarCheck size={24} /></div>
          <div className="stat-info">
            <h3>8</h3>
            <p>Check-ins Hoje</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><TrendingUp size={24} /></div>
          <div className="stat-info">
            <h3>R$ 4.250</h3>
            <p>Faturamento Diário</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
