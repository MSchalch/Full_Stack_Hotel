import React, { useState, useEffect } from 'react';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import { Search, Plus, MoreVertical, DollarSign } from 'lucide-react';
import api from '../services/api';
import './Hospedes.css';

const Pagamentos = () => {
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarPagamentos();
  }, []);

  const carregarPagamentos = async () => {
    try {
      const response = await api.get('/pagamentos');
      setPagamentos(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar pagamentos:", error);
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
          <h1>Controle de Pagamentos</h1>
          <p>Gerencie transações e status de pagamento</p>
        </div>
        <Button variant="primary">
          <Plus size={18} /> Registrar Pagamento
        </Button>
      </div>

      <div className="filter-bar">
        <div style={{ flexGrow: 1, maxWidth: '400px' }}>
          <Input placeholder="Buscar por ID da Reserva..." />
        </div>
        <Button variant="secondary">
          <Search size={18} /> Buscar
        </Button>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Reserva ID</th>
              <th>Valor Total</th>
              <th>Forma de Pag.</th>
              <th>Data</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{textAlign: 'center'}}>Carregando...</td></tr>
            ) : pagamentos.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign: 'center'}}>Nenhum pagamento encontrado.</td></tr>
            ) : (
              pagamentos.map((pagamento) => (
                <tr key={pagamento.id}>
                  <td>#{pagamento.reserva?.id || 'N/A'}</td>
                  <td>R$ {pagamento.valor?.toFixed(2).replace('.', ',')}</td>
                  <td>{pagamento.formaPagamento}</td>
                  <td>{formatarData(pagamento.dataOperacao)}</td>
                  <td>
                    <span className={`badge ${pagamento.statusPagamento === 'PAGO' ? 'badge-active' : 'badge-inactive'}`}>
                      {pagamento.statusPagamento}
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

export default Pagamentos;
