import React, { useState, useEffect } from 'react';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import { Search, Plus, MoreVertical, Key } from 'lucide-react';
import api from '../services/api';
import './Hospedes.css';

const Quartos = () => {
  const [quartos, setQuartos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarQuartos();
  }, []);

  const carregarQuartos = async () => {
    try {
      const response = await api.get('/quartos');
      setQuartos(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar quartos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Gerenciar Quartos</h1>
          <p>Lista de acomodações disponíveis</p>
        </div>
        <Button variant="primary">
          <Plus size={18} /> Novo Quarto
        </Button>
      </div>

      <div className="filter-bar">
        <div style={{ flexGrow: 1, maxWidth: '400px' }}>
          <Input placeholder="Buscar por número..." />
        </div>
        <Button variant="secondary">
          <Search size={18} /> Buscar
        </Button>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Tipo</th>
              <th>Preço Base</th>
              <th>Capacidade</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{textAlign: 'center'}}>Carregando...</td></tr>
            ) : quartos.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign: 'center'}}>Nenhum quarto encontrado.</td></tr>
            ) : (
              quartos.map((quarto) => (
                <tr key={quarto.id}>
                  <td><Key size={14} style={{verticalAlign: 'middle', marginRight: '6px'}}/> {quarto.numero}</td>
                  <td>{quarto.tipoQuarto}</td>
                  <td>R$ {quarto.precoBase?.toFixed(2).replace('.', ',')}</td>
                  <td>{quarto.capAdultos} Adultos, {quarto.capCriancas} Crianças</td>
                  <td>
                    <span className={`badge ${quarto.ativo ? 'badge-active' : 'badge-inactive'}`}>
                      {quarto.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
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

export default Quartos;
