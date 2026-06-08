import React, { useState, useEffect } from 'react';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import Modal from '../components/molecules/Modal';
import { Search, Plus, Edit2, Power, Trash2, Percent } from 'lucide-react';
import api from '../services/api';
import './Hospedes.css';

const Promocoes = () => {
  const [promocoes, setPromocoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [erroForm, setErroForm] = useState(null);

  const [tipoDesconto, setTipoDesconto] = useState('PORCENTAGEM'); // PORCENTAGEM ou FIXO
  const [formData, setFormData] = useState({
    id: null,
    nome: '',
    porcentagem: '',
    valorDesconto: '',
    ativo: true
  });

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

  const handleNovo = () => {
    setModalMode('create');
    setTipoDesconto('PORCENTAGEM');
    setFormData({ id: null, nome: '', porcentagem: '', valorDesconto: '', ativo: true });
    setErroForm(null);
    setIsModalOpen(true);
  };

  const preencherFormulario = (promo) => {
    setFormData({
      id: promo.id,
      nome: promo.nome || '',
      porcentagem: promo.porcentagem || '',
      valorDesconto: promo.valorDesconto || '',
      ativo: promo.ativo
    });
    if (promo.valorDesconto && !promo.porcentagem) {
      setTipoDesconto('FIXO');
    } else {
      setTipoDesconto('PORCENTAGEM');
    }
  };

  const handleEditar = (promo) => {
    setModalMode('edit');
    preencherFormulario(promo);
    setErroForm(null);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTipoChange = (e) => {
    setTipoDesconto(e.target.value);
    // Limpa o valor da outra opção para evitar inconsistência visual antes de salvar
    if (e.target.value === 'PORCENTAGEM') {
      setFormData(prev => ({ ...prev, valorDesconto: '' }));
    } else {
      setFormData(prev => ({ ...prev, porcentagem: '' }));
    }
  };

  const handleSalvar = async () => {
    try {
      setErroForm(null);
      const payload = {
        id: formData.id,
        nome: formData.nome,
        porcentagem: tipoDesconto === 'PORCENTAGEM' && formData.porcentagem ? parseFloat(formData.porcentagem) : null,
        valorDesconto: tipoDesconto === 'FIXO' && formData.valorDesconto ? parseFloat(formData.valorDesconto) : null,
        ativo: formData.ativo
      };

      if (modalMode === 'create') {
        await api.post('/promocoes', payload);
      } else {
        await api.put('/promocoes', payload);
      }
      setIsModalOpen(false);
      carregarPromocoes();
    } catch (err) {
      if (err.response && err.response.data && typeof err.response.data === 'string') {
        setErroForm(err.response.data);
      } else {
        setErroForm("Ocorreu um erro inesperado. Tente novamente.");
      }
    }
  };

  const handleToggleAtivo = async (promo) => {
    try {
      const payload = { ...promo, ativo: !promo.ativo };
      await api.put('/promocoes', payload);
      carregarPromocoes();
    } catch (err) {
      if (err.response && err.response.data && typeof err.response.data === 'string') {
        alert(err.response.data);
      } else {
        alert("Erro ao alterar status da promoção.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir esta promoção? (Recomendado apenas se não possuir histórico)')) {
      try {
        await api.delete(`/promocoes/${id}`);
        carregarPromocoes();
      } catch (err) {
        if (err.response && err.response.data && typeof err.response.data === 'string') {
          alert(err.response.data);
        } else {
          alert("Erro ao excluir promoção.");
        }
      }
    }
  };

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h2>Gerenciar Promoções</h2>
          <p>Configuração de descontos aplicáveis em reservas</p>
        </div>
        <Button variant="primary" onClick={handleNovo}>
          <Plus size={18} /> Nova Promoção
        </Button>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Porcentagem</th>
              <th>Valor Fixo</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{textAlign: 'center'}}>Carregando...</td></tr>
            ) : promocoes.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign: 'center'}}>Nenhuma promoção encontrada.</td></tr>
            ) : (
              promocoes.map((promo) => (
                <tr key={promo.id}>
                  <td><strong>#{promo.id}</strong></td>
                  <td>{promo.nome || '-'}</td>
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
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <button className="icon-btn edit-btn" title="Editar" onClick={() => handleEditar(promo)}>
                        <Edit2 size={18} />
                      </button>
                      <button className={`icon-btn ${promo.ativo ? 'danger-btn' : 'success-btn'}`} title={promo.ativo ? "Inativar" : "Ativar"} onClick={() => handleToggleAtivo(promo)}>
                        <Power size={18} />
                      </button>
                      <button className="icon-btn danger-btn" title="Excluir" onClick={() => handleDelete(promo.id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'create' ? "Nova Promoção" : "Editar Promoção"}>
        {erroForm && (
          <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '8px', fontSize: '14px', whiteSpace: 'pre-line', marginBottom: '16px' }}>
            {erroForm}
          </div>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <Input 
            label="Nome da Promoção" 
            name="nome" 
            value={formData.nome} 
            onChange={handleChange} 
            placeholder="Ex: Promoção de Verão" 
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>Tipo de Desconto</label>
            <div style={{ display: 'flex', gap: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="tipoDesconto" 
                  value="PORCENTAGEM" 
                  checked={tipoDesconto === 'PORCENTAGEM'} 
                  onChange={handleTipoChange} 
                />
                Porcentagem (%)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="tipoDesconto" 
                  value="FIXO" 
                  checked={tipoDesconto === 'FIXO'} 
                  onChange={handleTipoChange} 
                />
                Valor Fixo (R$)
              </label>
            </div>
          </div>

          <div style={{ minHeight: '80px' }}>
            {tipoDesconto === 'PORCENTAGEM' ? (
              <Input 
                label="Porcentagem de Desconto (%)" 
                name="porcentagem" 
                type="number" 
                step="0.1" 
                max="100"
                min="0"
                value={formData.porcentagem} 
                onChange={handleChange} 
                placeholder="10" 
              />
            ) : (
              <Input 
                className="no-spinners" 
                label="Valor Fixo de Desconto (R$)" 
                name="valorDesconto" 
                type="number" 
                step="0.01" 
                value={formData.valorDesconto} 
                onChange={handleChange} 
                placeholder="50.00" 
              />
            )}
          </div>
          
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleSalvar}>Salvar</Button>
        </div>
      </Modal>

    </div>
  );
};

export default Promocoes;
