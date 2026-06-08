import React, { useState, useEffect } from 'react';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import Modal from '../components/molecules/Modal';
import { Plus, Edit2, Power, Trash2, ShieldAlert } from 'lucide-react';
import api from '../services/api';
import './Hospedes.css';

const Politicas = () => {
  const [politicas, setPoliticas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [erroForm, setErroForm] = useState(null);

  const [formData, setFormData] = useState({
    id: null,
    nome: '',
    porcentagem: '',
    horasAntesCancelamento: '',
    estornoValor: 'true',
    ativo: true
  });

  useEffect(() => {
    carregarPoliticas();
  }, []);

  const carregarPoliticas = async () => {
    try {
      const response = await api.get('/politicas-cancelamento');
      setPoliticas(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar políticas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNovo = () => {
    setModalMode('create');
    setFormData({ id: null, nome: '', porcentagem: '', horasAntesCancelamento: '', estornoValor: 'true', ativo: true });
    setErroForm(null);
    setIsModalOpen(true);
  };

  const handleEditar = (pol) => {
    setModalMode('edit');
    setFormData({
      id: pol.id,
      nome: pol.nome || '',
      porcentagem: pol.porcentagem || '',
      horasAntesCancelamento: pol.horasAntesCancelamento || '',
      estornoValor: pol.estornoValor !== null ? pol.estornoValor.toString() : 'true',
      ativo: pol.ativo
    });
    setErroForm(null);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSalvar = async () => {
    try {
      setErroForm(null);
      const payload = {
        id: formData.id,
        nome: formData.nome,
        porcentagem: formData.porcentagem ? parseFloat(formData.porcentagem) : null,
        horasAntesCancelamento: formData.horasAntesCancelamento ? parseInt(formData.horasAntesCancelamento) : null,
        estornoValor: formData.estornoValor === 'true',
        ativo: formData.ativo
      };

      if (modalMode === 'create') {
        await api.post('/politicas-cancelamento', payload);
      } else {
        await api.put('/politicas-cancelamento', payload);
      }
      setIsModalOpen(false);
      carregarPoliticas();
    } catch (err) {
      if (err.response && err.response.data && typeof err.response.data === 'string') {
        setErroForm(err.response.data);
      } else {
        setErroForm("Ocorreu um erro inesperado. Tente novamente.");
      }
    }
  };

  const handleToggleAtivo = async (pol) => {
    try {
      const payload = { ...pol, ativo: !pol.ativo };
      await api.put('/politicas-cancelamento', payload);
      carregarPoliticas();
    } catch (err) {
      if (err.response && err.response.data && typeof err.response.data === 'string') {
        alert(err.response.data);
      } else {
        alert("Erro ao alterar status da política.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir esta política? (Recomendado apenas se não possuir histórico)')) {
      try {
        await api.delete(`/politicas-cancelamento/${id}`);
        carregarPoliticas();
      } catch (err) {
        if (err.response && err.response.data && typeof err.response.data === 'string') {
          alert(err.response.data);
        } else {
          alert("Erro ao excluir política.");
        }
      }
    }
  };

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h2>Políticas de Cancelamento</h2>
          <p>Regras de retenção de valores por cancelamento</p>
        </div>
        <Button variant="primary" onClick={handleNovo}>
          <Plus size={18} /> Nova Política
        </Button>
      </div>

      <div className="table-container" style={{ marginTop: '20px' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome da Política</th>
              <th>Multa (%)</th>
              <th>Horas de Antecedência</th>
              <th>Estorno de Valores</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{textAlign: 'center'}}>Carregando...</td></tr>
            ) : politicas.length === 0 ? (
              <tr><td colSpan="7" style={{textAlign: 'center'}}>Nenhuma política encontrada.</td></tr>
            ) : (
              politicas.map((pol) => (
                <tr key={pol.id}>
                  <td>
                    <ShieldAlert size={16} style={{verticalAlign: 'middle', marginRight: '8px', color: 'var(--color-primary)'}}/> 
                    <strong>#{pol.id}</strong>
                  </td>
                  <td>{pol.nome || 'Sem Nome'}</td>
                  <td>{pol.porcentagem}%</td>
                  <td>{pol.horasAntesCancelamento}h ({pol.horasAntesCancelamento / 24} dias)</td>
                  <td>
                    <span style={{ color: pol.estornoValor ? 'green' : 'var(--color-danger)', fontWeight: '500' }}>
                      {pol.estornoValor ? 'Sim' : 'Não'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${pol.ativo ? 'badge-active' : 'badge-inactive'}`}>
                      {pol.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <button className="icon-btn edit-btn" title="Editar" onClick={() => handleEditar(pol)}>
                        <Edit2 size={18} />
                      </button>
                      <button className={`icon-btn ${pol.ativo ? 'danger-btn' : 'success-btn'}`} title={pol.ativo ? "Inativar" : "Ativar"} onClick={() => handleToggleAtivo(pol)}>
                        <Power size={18} />
                      </button>
                      <button className="icon-btn danger-btn" title="Excluir" onClick={() => handleDelete(pol.id)}>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'create' ? "Nova Política" : "Editar Política"}>
        {erroForm && (
          <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '8px', fontSize: '14px', whiteSpace: 'pre-line', marginBottom: '16px' }}>
            {erroForm}
          </div>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <Input 
            label="Nome da Política" 
            name="nome" 
            value={formData.nome} 
            onChange={handleChange} 
            placeholder="Ex: Cancelamento 24h" 
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input 
              label="Taxa de Retenção/Multa (%)" 
              name="porcentagem" 
              type="number" 
              step="0.1" 
              max="100"
              min="0"
              value={formData.porcentagem} 
              onChange={handleChange} 
              placeholder="Ex: 50" 
            />

            <Input 
              label="Antecedência Limite (em Horas)" 
              name="horasAntesCancelamento" 
              type="number" 
              value={formData.horasAntesCancelamento} 
              onChange={handleChange} 
              placeholder="Ex: 48" 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>Permite estorno do valor pago?</label>
            <select 
              className="custom-input" 
              name="estornoValor" 
              value={formData.estornoValor} 
              onChange={handleChange}
            >
              <option value="true">Sim, permite estorno</option>
              <option value="false">Não, sem estorno</option>
            </select>
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

export default Politicas;
