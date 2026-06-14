import React, { useState, useEffect } from 'react';
import { Users, BedDouble, CalendarCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import './Home.css';

const Home = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    hospedesAtivos: 0,
    quartosAtivos: 0,
    reservasConfirmadas: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [hospedesRes, quartosRes, reservasRes] = await Promise.all([
          api.get('/hospedes', { params: { size: 1000 } }),
          api.get('/quartos', { params: { size: 1000 } }),
          api.get('/reservas', { params: { size: 1000 } })
        ]);
        
        const hospedes = hospedesRes.data?.content || [];
        const quartos = quartosRes.data?.content || [];
        const reservas = reservasRes.data?.content || [];

        setStats({
          hospedesAtivos: hospedes.length, 
          quartosAtivos: quartos.filter(q => q.ativo).length,
          reservasConfirmadas: reservas.filter(r => r.status === 'CONFIRMADA').length
        });
      } catch (error) {
        console.error("Erro ao carregar estatísticas", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>{t('home.title', 'Painel')}</h1>
          <p>{t('home.subtitle', 'Visão geral do sistema')}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Users size={24} /></div>
          <div className="stat-info">
            <h3>{stats.hospedesAtivos}</h3>
            <p>{t('home.active_guests', 'Hóspedes Ativos')}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><BedDouble size={24} /></div>
          <div className="stat-info">
            <h3>{stats.quartosAtivos}</h3>
            <p>{t('home.active_rooms', 'Quartos Ativos')}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><CalendarCheck size={24} /></div>
          <div className="stat-info">
            <h3>{stats.reservasConfirmadas}</h3>
            <p>{t('home.confirmed_reservations', 'Reservas Confirmadas')}</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
        <img 
          src="https://casaraodocha.org.br/wp/wp-content/uploads/2014/05/cropped-cropped-casarao1.jpg" 
          alt="Casarão do Chá"
          style={{ 
            width: '100%', 
            maxWidth: '1260px', 
            height: '450px', 
            objectFit: 'cover', 
            borderRadius: 'var(--radius-custom)', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
            border: '1px solid var(--color-border)'
          }}
        />
      </div>
    </div>
  );
};

export default Home;
