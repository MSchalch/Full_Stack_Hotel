import React, { useState, useEffect } from 'react';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import { Search, Plus, MoreVertical, Percent } from 'lucide-react';
import api from '../services/api';
import './Hospedes.css'; // Usando o mesmo CSS de layout de tabela

const Promocoes = () => {
  const [promocoes, setPromocoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarPromocoes();
  }, []);

  const carregarPromocoes = async () => {
    try {
      const response = await api.get('/promocoes');
      setPromocoes(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar promoções:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Gerenciar Promoções</h1>
          <p>Configure descontos e campanhas do hotel</p>
        </div>
        <Button variant="primary">
          <Plus size={18} /> Nova Promoção
        </Button>
      </div>

      <div className="filter-bar">
        <div style={{ flexGrow: 1, maxWidth: '400px' }}>
          <Input placeholder="Buscar promoção..." />
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
              <th>Porcentagem</th>
              <th>Valor Fixo</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{textAlign: 'center'}}>Carregando...</td></tr>
            ) : promocoes.length === 0 ? (
              <tr><td colSpan="5" style={{textAlign: 'center'}}>Nenhuma promoção encontrada.</td></tr>
            ) : (
              promocoes.map((promo) => (
                <tr key={promo.id}>
                  <td>#{promo.id}</td>
                  <td>
                    {promo.porcentagem ? (
                      <><Percent size={14} style={{verticalAlign: 'middle', marginRight: '4px'}}/>{promo.porcentagem}%</>
                    ) : '-'}
                  </td>
                  <td>{promo.valorDesconto ? `R$ ${promo.valorDesconto.toFixed(2).replace('.', ',')}` : '-'}</td>
                  <td>
                    <span className={`badge ${promo.ativo ? 'badge-active' : 'badge-inactive'}`}>
                      {promo.ativo ? 'Ativo' : 'Inativo'}
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

export default Promocoes;
