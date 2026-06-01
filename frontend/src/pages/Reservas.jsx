import React, { useState, useEffect } from 'react';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import { Search, Plus, MoreVertical, Calendar } from 'lucide-react';
import api from '../services/api';
import './Hospedes.css';

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarReservas();
  }, []);

  const carregarReservas = async () => {
    try {
      const response = await api.get('/reservas');
      setReservas(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar reservas:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataStr) => {
    if(!dataStr) return '-';
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Gerenciar Reservas</h1>
          <p>Acompanhe os check-ins e check-outs</p>
        </div>
        <Button variant="primary">
          <Plus size={18} /> Nova Reserva
        </Button>
      </div>

      <div className="filter-bar">
        <div style={{ flexGrow: 1, maxWidth: '400px' }}>
          <Input placeholder="Buscar por hóspede ou quarto..." />
        </div>
        <Button variant="secondary">
          <Search size={18} /> Buscar
        </Button>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Hóspede</th>
              <th>Quarto</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{textAlign: 'center'}}>Carregando...</td></tr>
            ) : reservas.length === 0 ? (
              <tr><td colSpan="7" style={{textAlign: 'center'}}>Nenhuma reserva encontrada.</td></tr>
            ) : (
              reservas.map((reserva) => (
                <tr key={reserva.id}>
                  <td>#{reserva.id}</td>
                  <td>{reserva.hospede?.nomeCompleto || 'Desconhecido'}</td>
                  <td>{reserva.quarto?.numero || 'N/A'}</td>
                  <td><Calendar size={14} style={{verticalAlign: 'middle', marginRight: '4px'}}/> {formatarData(reserva.checkIn)}</td>
                  <td><Calendar size={14} style={{verticalAlign: 'middle', marginRight: '4px'}}/> {formatarData(reserva.checkOut)}</td>
                  <td><span className={`badge ${reserva.status === 'CONFIRMADA' ? 'badge-active' : 'badge-inactive'}`}>{reserva.status}</span></td>
                  <td><button className="icon-btn"><MoreVertical size={18} /></button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reservas;
