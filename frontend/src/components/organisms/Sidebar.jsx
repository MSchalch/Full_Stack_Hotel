import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Tag, ShieldOff, BedDouble, CalendarCheck, CreditCard, BarChart3, Coffee } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Sidebar.css';

const Sidebar = () => {
  const { t } = useTranslation();

  const links = [
    { to: '/', icon: <Home size={20} />, label: t('menu.home', 'Dashboard') },
    { to: '/hospedes', icon: <Users size={20} />, label: t('menu.hospedes', 'Hóspedes') },
    { to: '/reservas', icon: <CalendarCheck size={20} />, label: t('menu.reservas', 'Reservas') },
    { to: '/quartos', icon: <BedDouble size={20} />, label: t('menu.quartos', 'Quartos') },
    { to: '/promocoes', icon: <Tag size={20} />, label: t('menu.promocoes', 'Promoções') },
    { to: '/politicas', icon: <ShieldOff size={20} />, label: t('menu.politicas', 'Políticas') },
    { to: '/pagamentos', icon: <CreditCard size={20} />, label: t('menu.pagamentos', 'Pagamentos') },
    { to: '/relatorios', icon: <BarChart3 size={20} />, label: t('menu.relatorios', 'Relatórios') },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">
          <Coffee size={28} />
        </div>
        <div className="logo-text">
          <h2>Hotel do Casarão</h2>
          <p>Cocuera, Mogi das Cruzes</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink 
            key={link.to} 
            to={link.to} 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
