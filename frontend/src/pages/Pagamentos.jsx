import React, { useState, useEffect } from 'react';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import Modal from '../components/molecules/Modal';
import { Search, Plus, MoreVertical, DollarSign, ArrowLeftRight } from 'lucide-react';
import api from '../services/api';
import './Hospedes.css';

const Pagamentos = () => {
  const [pagamentos, setPagamentos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [erroForm, setErroForm] = useState(null);

  const [formData, setFormData] = useState({
    id: null,
    reservaId: '',
    valor: '',
    formaPagamento: 'PIX',
    statusPagamento: 'APROVADO' // Padrão novo pagamento já como aprovado
  });

  useEffect(() => {
    carregarPagamentos();
    carregarReservas();
  }, []);

  const carregarPagamentos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pagamentos');
      setPagamentos(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar pagamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const carregarReservas = async () => {
    try {
      const response = await api.get('/reservas');
      setReservas(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar reservas:", error);
    }
  };

  const handleNovo = () => {
    setModalMode('create');
    setFormData({
      id: null,
      reservaId: '',
      valor: '',
      formaPagamento: 'PIX',
      statusPagamento: 'APROVADO'
    });
    setErroForm(null);
    setIsModalOpen(true);
  };

  const handleEditar = (pagamento) => {
    setModalMode('edit');
    setFormData({
      id: pagamento.id,
      reservaId: pagamento.reserva?.id || '',
      valor: pagamento.valor || '',
      formaPagamento: pagamento.formaPagamento || 'PIX',
      statusPagamento: pagamento.statusPagamento || 'APROVADO'
    });
    setErroForm(null);
    setIsModalOpen(true);
  };

  const handleReservaChange = (e) => {
    const rId = e.target.value;
    const reservaEncontrada = reservas.find(r => r.id.toString() === rId);
    
    setFormData(prev => ({ 
      ...prev, 
      reservaId: rId,
      valor: reservaEncontrada && reservaEncontrada.valorTotal ? reservaEncontrada.valorTotal : ''
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSalvar = async () => {
    try {
      setErroForm(null);
      const payload = {
        id: formData.id,
        valor: parseFloat(formData.valor),
        formaPagamento: formData.formaPagamento,
        statusPagamento: formData.statusPagamento,
        reserva: formData.reservaId ? { id: parseInt(formData.reservaId) } : null
      };

      if (modalMode === 'create') {
        await api.post('/pagamentos', payload);
      } else {
        await api.put('/pagamentos', payload);
      }
      setIsModalOpen(false);
      carregarPagamentos();
      carregarReservas(); // Recarrega reservas pq o status da reserva pode mudar
    } catch (err) {
      if (err.response && err.response.data && typeof err.response.data === 'string') {
        setErroForm(err.response.data);
      } else {
        setErroForm("Ocorreu um erro ao salvar o pagamento. Verifique os dados.");
      }
    }
  };

  const formatarDataLocal = (dataStr) => {
    if(!dataStr) return '-';
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h2>Controle de Pagamentos</h2>
          <p>Recebimentos e faturamento das reservas</p>
        </div>
        <Button variant="primary" onClick={handleNovo}>
          <DollarSign size={18} /> Registrar Pagamento
        </Button>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Reserva / Hóspede</th>
              <th>Valor Recebido</th>
              <th>Forma</th>
              <th>Data/Hora</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{textAlign: 'center'}}>Carregando...</td></tr>
            ) : pagamentos.length === 0 ? (
              <tr><td colSpan="7" style={{textAlign: 'center'}}>Nenhum pagamento registrado.</td></tr>
            ) : (
              pagamentos.map((pagamento) => (
                <tr key={pagamento.id}>
                  <td><strong>#{pagamento.id}</strong></td>
                  <td>
                    <div style={{ fontSize: '13px' }}>
                      <strong>Reserva #{pagamento.reserva?.id}</strong>
                      <br/>
                      <span style={{ color: '#666' }}>{pagamento.reserva?.hospede?.nomeCompleto || 'Desconhecido'}</span>
                    </div>
                  </td>
                  <td><strong>R$ {pagamento.valor ? pagamento.valor.toFixed(2).replace('.', ',') : '0,00'}</strong></td>
                  <td><span className="badge badge-inactive">{pagamento.formaPagamento}</span></td>
                  <td style={{ fontSize: '13px' }}>{formatarDataLocal(pagamento.dataOperacao)}</td>
                  <td>
                    <span className={`badge ${pagamento.statusPagamento === 'APROVADO' ? 'badge-active' : (pagamento.statusPagamento === 'ESTORNADO' ? 'badge-warning' : 'badge-inactive')}`}>
                      {pagamento.statusPagamento}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <button className="icon-btn edit-btn" title="Editar / Estornar" onClick={() => handleEditar(pagamento)}>
                        <ArrowLeftRight size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'create' ? "Registrar Pagamento" : "Editar Pagamento / Estorno"}>
        {erroForm && (
          <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '8px', fontSize: '14px', whiteSpace: 'pre-line', marginBottom: '16px' }}>
            {erroForm}
          </div>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>Reserva</label>
            <select 
              className="custom-input" 
              name="reservaId" 
              value={formData.reservaId} 
              onChange={handleReservaChange}
              disabled={modalMode === 'edit'} // Não pode trocar reserva depois de pago
            >
              <option value="">Selecione a reserva pendente...</option>
              {modalMode === 'create' ? 
                reservas.filter(r => r.status === 'PROPOSTA' || r.status === 'CONFIRMADA').map(r => (
                  <option key={r.id} value={r.id}>
                    Reserva #{r.id} - {r.hospede?.nomeCompleto} - R$ {r.valorTotal}
                  </option>
                )) : 
                reservas.filter(r => r.id.toString() === formData.reservaId.toString()).map(r => (
                  <option key={r.id} value={r.id}>
                    Reserva #{r.id} - {r.hospede?.nomeCompleto}
                  </option>
                ))
              }
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input 
              label="Valor (R$)" 
              name="valor" 
              type="number"
              step="0.01" 
              value={formData.valor} 
              onChange={handleChange}
              disabled={modalMode === 'edit'}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500' }}>Forma de Pagamento</label>
              <select 
                className="custom-input" 
                name="formaPagamento" 
                value={formData.formaPagamento} 
                onChange={handleChange}
                disabled={modalMode === 'edit'}
              >
                <option value="PIX">Pix</option>
                <option value="CARTAO_CREDITO">Cartão de Crédito</option>
                <option value="CARTAO_DEBITO">Cartão de Débito</option>
                <option value="DINHEIRO">Dinheiro</option>
                <option value="BOLETO">Boleto Bancário</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>Status do Pagamento</label>
            <select 
              className="custom-input" 
              name="statusPagamento" 
              value={formData.statusPagamento} 
              onChange={handleChange}
            >
              <option value="PENDENTE">Pendente</option>
              <option value="APROVADO">Aprovado (Confirmar Reserva)</option>
              <option value="NEGADO">Negado</option>
              {modalMode === 'edit' && <option value="ESTORNADO">Estornado (Reembolso / Cancelar Reserva)</option>}
            </select>
            {formData.statusPagamento === 'ESTORNADO' && (
              <span style={{ fontSize: '12px', color: '#b45309' }}>Atenção: Mudar para ESTORNADO vai cancelar a reserva automaticamente!</span>
            )}
          </div>
          
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleSalvar}>{modalMode === 'create' ? "Registrar Pagamento" : "Atualizar Pagamento"}</Button>
        </div>
      </Modal>

    </div>
  );
};

export default Pagamentos;
