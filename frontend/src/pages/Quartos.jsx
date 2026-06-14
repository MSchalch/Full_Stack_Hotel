import React, { useState, useEffect } from 'react';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import Modal from '../components/molecules/Modal';
import { Search, Plus, Edit2, Power, Trash2, Key, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import './Hospedes.css';

const Quartos = () => {
  const { t } = useTranslation();
  const [quartos, setQuartos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit'
  const [erroForm, setErroForm] = useState(null);
  const [termoBusca, setTermoBusca] = useState('');
  
  const [formData, setFormData] = useState({
    id: null,
    numero: '',
    tipoQuarto: 'SINGLE',
    precoBase: '',
    capAdultos: '',
    capCriancas: '',
    ativo: true
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      carregarQuartos();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [termoBusca]);

  const carregarQuartos = async () => {
    try {
      const response = await api.get('/quartos', { params: { termo: termoBusca } });
      setQuartos(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar quartos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNovo = () => {
    setModalMode('create');
    setFormData({ id: null, numero: '', tipoQuarto: 'SINGLE', precoBase: '', capAdultos: '', capCriancas: '', ativo: true });
    setErroForm(null);
    setIsModalOpen(true);
  };

  const preencherFormulario = (quarto) => {
    setFormData({
      id: quarto.id,
      numero: quarto.numero || '',
      tipoQuarto: quarto.tipoQuarto || 'SINGLE',
      precoBase: quarto.precoBase || '',
      capAdultos: quarto.capAdultos || '',
      capCriancas: quarto.capCriancas || '',
      ativo: quarto.ativo
    });
  };

  const handleEditar = (quarto) => {
    setModalMode('edit');
    preencherFormulario(quarto);
    setErroForm(null);
    setIsModalOpen(true);
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
        numero: formData.numero ? parseInt(formData.numero) : null,
        tipoQuarto: formData.tipoQuarto,
        precoBase: formData.precoBase ? parseFloat(formData.precoBase) : null,
        capAdultos: formData.capAdultos ? parseInt(formData.capAdultos) : null,
        capCriancas: formData.capCriancas ? parseInt(formData.capCriancas) : null,
        ativo: formData.ativo
      };

      if (modalMode === 'create') {
        await api.post('/quartos', payload);
      } else {
        await api.put('/quartos', payload);
      }
      setIsModalOpen(false);
      carregarQuartos();
    } catch (err) {
      if (err.response && err.response.data && typeof err.response.data === 'string') {
        setErroForm(err.response.data);
      } else {
        setErroForm("Ocorreu um erro inesperado. Tente novamente.");
      }
    }
  };

  const handleToggleAtivo = async (quarto) => {
    try {
      const payload = { ...quarto, ativo: !quarto.ativo };
      await api.put('/quartos', payload);
      carregarQuartos();
    } catch (err) {
      if (err.response && err.response.data && typeof err.response.data === 'string') {
        alert(err.response.data);
      } else {
        alert("Erro ao alterar status do quarto.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('quartos.delete_confirm'))) {
      try {
        await api.delete(`/quartos/${id}`);
        carregarQuartos();
      } catch (err) {
        if (err.response && err.response.data && typeof err.response.data === 'string') {
          alert(err.response.data);
        } else {
          alert("Erro ao excluir quarto.");
        }
      }
    }
  };

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h2>{t('quartos.title')}</h2>
          <p>{t('quartos.subtitle')}</p>
        </div>
        <Button variant="primary" onClick={handleNovo}>
          <Plus size={18} /> {t('quartos.new')}
        </Button>
      </div>

      <div className="filter-bar" style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flexGrow: 1, maxWidth: '400px', position: 'relative' }}>
          <Input 
            placeholder={t('quartos.search_placeholder')} 
            value={termoBusca} 
            onChange={(e) => setTermoBusca(e.target.value)} 
            style={{ paddingRight: '36px' }}
          />
          {termoBusca && (
            <button 
              onClick={() => setTermoBusca('')} 
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px'
              }}
              title="Limpar busca"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <Button variant="secondary" onClick={carregarQuartos}>
          <Search size={18} /> {t('common.search')}
        </Button>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>{t('quartos.table.number')}</th>
              <th>{t('quartos.table.type')}</th>
              <th>{t('quartos.table.base_price')}</th>
              <th>{t('quartos.table.capacity')}</th>
              <th>{t('quartos.table.status')}</th>
              <th style={{ textAlign: 'center' }}>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{textAlign: 'center'}}>{t('common.loading')}</td></tr>
            ) : quartos.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign: 'center'}}>{t('quartos.not_found')}</td></tr>
            ) : (
              quartos.map((quarto) => (
                <tr key={quarto.id}>
                  <td><Key size={14} style={{verticalAlign: 'middle', marginRight: '6px'}}/> {quarto.numero}</td>
                  <td>{quarto.tipoQuarto}</td>
                  <td>R$ {quarto.precoBase ? quarto.precoBase.toFixed(2).replace('.', ',') : '0,00'}</td>
                  <td>{quarto.capAdultos} {t('quartos.table.adults')}, {quarto.capCriancas} {t('quartos.table.kids')}</td>
                  <td>
                    <span className={`badge ${quarto.ativo ? 'badge-active' : 'badge-inactive'}`}>
                      {quarto.ativo ? t('common.active') : t('common.inactive')}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <button className="icon-btn edit-btn" title="Editar" onClick={() => handleEditar(quarto)}>
                        <Edit2 size={18} />
                      </button>
                      <button className={`icon-btn ${quarto.ativo ? 'danger-btn' : 'success-btn'}`} title={quarto.ativo ? "Inativar" : "Ativar"} onClick={() => handleToggleAtivo(quarto)}>
                        <Power size={18} />
                      </button>
                      <button className="icon-btn danger-btn" title="Excluir" onClick={() => handleDelete(quarto.id)}>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'create' ? t('quartos.modal.new') : t('quartos.modal.edit')}>
        {erroForm && (
          <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '8px', fontSize: '14px', whiteSpace: 'pre-line' }}>
            {erroForm}
          </div>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input label={t('quartos.modal.number')} name="numero" type="number" value={formData.numero} onChange={handleChange} placeholder="101" />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500' }}>{t('quartos.modal.type')}</label>
              <select 
                name="tipoQuarto" 
                value={formData.tipoQuarto} 
                onChange={handleChange}
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-main)' }}
              >
                <option value="SINGLE" style={{ color: 'black' }}>{t('quartos.type.single')}</option>
                <option value="DUPLO" style={{ color: 'black' }}>{t('quartos.type.double')}</option>
                <option value="SUITE" style={{ color: 'black' }}>{t('quartos.type.suite')}</option>
                <option value="SUITE_LUXO" style={{ color: 'black' }}>{t('quartos.type.suite_luxo')}</option>
                <option value="SUITE_PRESIDENCIAL" style={{ color: 'black' }}>{t('quartos.type.suite_presidencial')}</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input label={t('quartos.modal.cap_adults')} name="capAdultos" type="number" value={formData.capAdultos} onChange={handleChange} placeholder="2" />
            <Input label={t('quartos.modal.cap_kids')} name="capCriancas" type="number" value={formData.capCriancas} onChange={handleChange} placeholder="1" />
          </div>

          <Input className="no-spinners" label={t('quartos.modal.base_price')} name="precoBase" type="number" step="0.01" value={formData.precoBase} onChange={handleChange} placeholder="150.00" />
          
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>{t('common.cancel')}</Button>
          <Button variant="primary" onClick={handleSalvar}>{t('common.save')}</Button>
        </div>
      </Modal>

    </div>
  );
};

export default Quartos;
