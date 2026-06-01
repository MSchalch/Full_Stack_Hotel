import React, { useState, useEffect } from 'react';
import Button from '../components/atoms/Button';
import { Plus, MoreVertical, ShieldAlert } from 'lucide-react';
import api from '../services/api';
import './Hospedes.css';

const Politicas = () => {
  const [politicas, setPoliticas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarPoliticas();
  }, []);

  const carregarPoliticas = async () => {
    try {
      const response = await api.get('/politicas-cancelamento');
      setPoliticas(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar politicas:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Políticas de Cancelamento</h1>
          <p>Regras e porcentagens de reembolso</p>
        </div>
        <Button variant="primary">
          <Plus size={18} /> Nova Política
        </Button>
      </div>

      <div className="table-container" style={{ marginTop: '20px' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID / Info</th>
              <th>Taxa de Retenção</th>
              <th>Dias Limite</th>
              <th>Estorno</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{textAlign: 'center'}}>Carregando...</td></tr>
            ) : politicas.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign: 'center'}}>Nenhuma política encontrada.</td></tr>
            ) : (
              politicas.map((politica) => (
                <tr key={politica.id}>
                  <td><ShieldAlert size={16} style={{verticalAlign: 'middle', marginRight: '8px', color: 'var(--color-primary)'}}/> Regra #{politica.id}</td>
                  <td>{politica.porcentagem}%</td>
                  <td>{politica.horasAntesCancelamento / 24} dias</td>
                  <td>{politica.estornoValor ? 'Sim' : 'Não'}</td>
                  <td>
                    <span className={`badge ${politica.ativo ? 'badge-active' : 'badge-inactive'}`}>
                      {politica.ativo ? 'Ativo' : 'Inativo'}
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

export default Politicas;
