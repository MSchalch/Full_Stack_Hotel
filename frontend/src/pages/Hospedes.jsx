import React, { useState, useEffect } from 'react';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import Modal from '../components/molecules/Modal';
import { Search, Plus, Eye, Edit2, Power, Trash2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Pagination from '../components/molecules/Pagination';
import api from '../services/api';
import './Hospedes.css';

const Hospedes = () => {
  const { t } = useTranslation();
  const [hospedes, setHospedes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [termoBusca, setTermoBusca] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 10;
  
  // Estados do Modal e Formulário
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [erroForm, setErroForm] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [filtroIdade, setFiltroIdade] = useState('TODOS');
  const [showRespDropdown, setShowRespDropdown] = useState(false);
  
  const [formData, setFormData] = useState({
    id: null,
    nomeCompleto: '',
    cpf: '',
    dataNascimento: '',
    email: '',
    telefone: '',
    responsavelId: '',
    responsavelNomeBusca: '',
    cep: '',
    logradouro: '',
    bairro: '',
    cidade: '',
    estado: '',
    numero: '',
    complemento: ''
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(0);
      carregarHospedes(0);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [termoBusca]);

  useEffect(() => {
    carregarHospedes(page);
  }, [page]);

  const carregarHospedes = async (currentPage = page) => {
    try {
      const response = await api.get('/hospedes', { params: { termo: termoBusca, page: currentPage, size } });
      setHospedes(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error("Erro ao carregar hóspedes:", error);
    } finally {
      setLoading(false);
    }
  };

  const buscarCep = async (cepBuscado) => {
    const cepNumeros = cepBuscado.replace(/\D/g, '');
    if (cepNumeros.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf
          }));
        }
      } catch (err) {
        console.error("Erro ao buscar CEP:", err);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'cep') {
      buscarCep(value);
    }
  };

  const handleNovo = () => {
    setModalMode('create');
    setFormData({ id: null, nomeCompleto: '', cpf: '', dataNascimento: '', email: '', telefone: '', responsavelId: '', responsavelNomeBusca: '', cep: '', logradouro: '', bairro: '', cidade: '', estado: '', numero: '', complemento: '' });
    setErroForm(null);
    setIsModalOpen(true);
  };

  const calcularIdade = (dataString) => {
    if (!dataString) return 0;
    const hoje = new Date();
    const nasc = new Date(dataString);
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
      idade--;
    }
    return idade;
  };

  const preencherFormulario = (hospede) => {
    setFormData({
      id: hospede.id,
      nomeCompleto: hospede.nomeCompleto || '',
      cpf: hospede.cpf || '',
      dataNascimento: hospede.dataNascimento || '',
      email: hospede.email || '',
      telefone: hospede.telefone || '',
      responsavelId: hospede.responsavel?.id || '',
      responsavelNomeBusca: hospede.responsavel ? `${hospede.responsavel.nomeCompleto} - ${hospede.responsavel.cpf}` : '',
      cep: hospede.endereco?.cep || '',
      logradouro: hospede.endereco?.logradouro || '',
      bairro: hospede.endereco?.bairro || '',
      cidade: hospede.endereco?.cidade || '',
      estado: hospede.endereco?.estado || '',
      numero: hospede.endereco?.numero || '',
      complemento: hospede.endereco?.complemento || ''
    });
  };

  const handleView = (hospede) => {
    setModalMode('view');
    preencherFormulario(hospede);
    setErroForm(null);
    setIsModalOpen(true);
  };

  const handleEdit = (hospede) => {
    setModalMode('edit');
    preencherFormulario(hospede);
    setErroForm(null);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (hospede) => {
    if (window.confirm(`Deseja realmente ${hospede.ativo ? 'inativar' : 'ativar'} o hóspede ${hospede.nomeCompleto}?`)) {
      try {
        const payload = { ...hospede, ativo: !hospede.ativo };
        await api.put('/hospedes', payload);
        carregarHospedes();
      } catch (err) {
        alert("Erro ao alterar status do hóspede.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir este hóspede permanentemente?')) {
      try {
        await api.delete(`/hospedes/${id}`);
        carregarHospedes();
      } catch (err) {
        if (err.response && err.response.data && typeof err.response.data === 'string') {
          alert(err.response.data);
        } else {
          alert("Erro ao excluir hóspede.");
        }
      }
    }
  };

  const handleSalvar = async () => {
    setSaving(true);
    setErroForm(null);
    try {
      const payload = {
        id: formData.id,
        nomeCompleto: formData.nomeCompleto,
        cpf: formData.cpf,
        dataNascimento: formData.dataNascimento,
        telefone: formData.telefone,
        email: formData.email,
        responsavel: formData.responsavelId ? { id: parseInt(formData.responsavelId) } : null,
        endereco: {
          cep: formData.cep,
          logradouro: formData.logradouro,
          bairro: formData.bairro,
          cidade: formData.cidade,
          estado: formData.estado,
          numero: formData.numero,
          complemento: formData.complemento
        }
      };

      if (modalMode === 'edit') {
        await api.put('/hospedes', payload);
      } else {
        await api.post('/hospedes', payload);
      }
      
      setIsModalOpen(false);
      carregarHospedes();
    } catch (error) {
      if (error.response && error.response.data) {
        const data = error.response.data;
        if (typeof data === 'string') {
          // Usa o t() para traduzir a string exata do erro que vem do Java, 
          // caso não encontre retorna a própria string
          setErroForm(t(data, data));
        } else if (data.message) {
          setErroForm(t(data.message, data.message));
        } else {
          setErroForm(t('backend_error_default', "Ocorreu um erro ao processar a requisição."));
        }
      } else {
        setErroForm(t('backend_error_default', "Ocorreu um erro ao processar a requisição."));
      }
    } finally {
      setSaving(false);
    }
  };

  const hospedesExibidos = hospedes.filter(h => {
    if (filtroIdade === 'TODOS') return true;
    const idade = calcularIdade(h.dataNascimento);
    if (filtroIdade === 'ADULTOS') return idade >= 18;
    if (filtroIdade === 'CRIANCAS') return idade < 18;
    return true;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>{t('hospedes.title')}</h1>
          <p>{t('hospedes.subtitle')}</p>
        </div>
        <Button variant="primary" onClick={handleNovo}>
          <Plus size={18} /> {t('hospedes.new')}
        </Button>
      </div>

      <div className="filter-bar" style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flexGrow: 1, maxWidth: '400px', position: 'relative' }}>
          <Input 
            placeholder={t('hospedes.search_placeholder')} 
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text-main)' }}>{t('hospedes.filter_age')}</label>
          <select 
            value={filtroIdade} 
            onChange={(e) => setFiltroIdade(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-main)', outline: 'none', cursor: 'pointer' }}
          >
            <option value="TODOS" style={{ color: 'black' }}>{t('hospedes.all')}</option>
            <option value="ADULTOS" style={{ color: 'black' }}>{t('hospedes.adults')}</option>
            <option value="CRIANCAS" style={{ color: 'black' }}>{t('hospedes.kids')}</option>
          </select>
        </div>
        <Button variant="secondary" onClick={carregarHospedes}>
          <Search size={18} /> {t('common.search', 'Buscar')}
        </Button>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>{t('hospedes.table.name')}</th>
              <th>{t('hospedes.table.cpf')}</th>
              <th>{t('hospedes.table.status')}</th>
              <th>{t('hospedes.table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{textAlign: 'center'}}>{t('common.loading')}</td></tr>
            ) : hospedesExibidos.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '24px' }}>
                  {t('hospedes.not_found')}
                </td>
              </tr>
            ) : (
              hospedesExibidos.map((hospede) => (
                <tr key={hospede.id}>
                  <td>{hospede.nomeCompleto}</td>
                  <td>{hospede.cpf}</td>
                  <td>
                    <span className={`badge ${hospede.ativo ? 'badge-active' : 'badge-inactive'}`}>
                      {hospede.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td style={{ display: 'flex', gap: '8px' }}>
                    <button className="icon-btn" onClick={() => handleView(hospede)} title="Ver Detalhes"><Eye size={18} /></button>
                    <button className="icon-btn" onClick={() => handleEdit(hospede)} title="Editar"><Edit2 size={18} /></button>
                    <button className="icon-btn" onClick={() => handleToggleStatus(hospede)} title={hospede.ativo ? 'Inativar' : 'Ativar'}><Power size={18} color={hospede.ativo ? 'var(--color-danger)' : 'var(--color-success)'} /></button>
                    <button className="icon-btn" onClick={() => handleDelete(hospede.id)} title="Excluir"><Trash2 size={18} color="var(--color-danger)" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {/* Modal de Cadastro */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'create' ? "Novo Hóspede" : modalMode === 'edit' ? "Editar Hóspede" : "Detalhes do Hóspede"}>
        {erroForm && (
          <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '8px', fontSize: '14px', whiteSpace: 'pre-line' }}>
            {erroForm}
          </div>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Nome Completo" name="nomeCompleto" value={formData.nomeCompleto} onChange={handleChange} placeholder="João da Silva" readOnly={modalMode === 'view'} disabled={modalMode === 'view'} />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input label="CPF" name="cpf" value={formData.cpf} onChange={handleChange} placeholder="Apenas números" readOnly={modalMode === 'view'} disabled={modalMode === 'view'} />
            <Input label="Data de Nascimento" type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} readOnly={modalMode === 'view'} disabled={modalMode === 'view'} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>Responsável {calcularIdade(formData.dataNascimento) < 18 ? '*' : '(Opcional)'}</label>
            <Input 
              placeholder="Digite o nome ou CPF para buscar..."
              value={formData.responsavelNomeBusca || ''}
              onChange={(e) => {
                setFormData(prev => ({...prev, responsavelNomeBusca: e.target.value, responsavelId: ''}));
              }}
              readOnly={modalMode === 'view'}
              disabled={modalMode === 'view'}
              onFocus={() => setShowRespDropdown(true)}
              onBlur={() => setTimeout(() => setShowRespDropdown(false), 200)}
            />
            {showRespDropdown && modalMode !== 'view' && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', maxHeight: '150px', overflowY: 'auto', zIndex: 10, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                {hospedes.filter(h => (!formData.id || h.id !== formData.id) && calcularIdade(h.dataNascimento) >= 18 && (h.nomeCompleto.toLowerCase().includes((formData.responsavelNomeBusca||'').toLowerCase()) || h.cpf.includes(formData.responsavelNomeBusca||''))).length === 0 && (
                   <div style={{ padding: '8px 12px', color: 'var(--color-text-muted)' }}>Nenhum adulto encontrado</div>
                )}
                {hospedes.filter(h => (!formData.id || h.id !== formData.id) && calcularIdade(h.dataNascimento) >= 18 && (h.nomeCompleto.toLowerCase().includes((formData.responsavelNomeBusca||'').toLowerCase()) || h.cpf.includes(formData.responsavelNomeBusca||''))).map(resp => (
                  <div 
                    key={resp.id} 
                    style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-main)' }}
                    onClick={() => {
                      setFormData(prev => ({...prev, responsavelId: resp.id, responsavelNomeBusca: `${resp.nomeCompleto} - ${resp.cpf}`}));
                      setShowRespDropdown(false);
                    }}
                  >
                    {resp.nomeCompleto} - {resp.cpf}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input label="E-mail" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="joao@email.com" readOnly={modalMode === 'view'} disabled={modalMode === 'view'} />
            <Input label="Telefone" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="(11) 99999-9999" readOnly={modalMode === 'view'} disabled={modalMode === 'view'} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input label="CEP" name="cep" value={formData.cep} onChange={handleChange} placeholder="00000-000" readOnly={modalMode === 'view'} disabled={modalMode === 'view'} />
            <Input label="Número" name="numero" value={formData.numero} onChange={handleChange} placeholder="123" readOnly={modalMode === 'view'} disabled={modalMode === 'view'} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input label="Logradouro" name="logradouro" value={formData.logradouro} readOnly disabled placeholder="Rua..." />
            <Input label="Bairro" name="bairro" value={formData.bairro} readOnly disabled placeholder="Bairro..." />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input label="Cidade" name="cidade" value={formData.cidade} readOnly disabled />
            <Input label="UF" name="estado" value={formData.estado} readOnly disabled />
          </div>
          <Input label="Complemento" name="complemento" value={formData.complemento} onChange={handleChange} placeholder="Apto 45" readOnly={modalMode === 'view'} disabled={modalMode === 'view'} />
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>{modalMode === 'view' ? 'Fechar' : 'Cancelar'}</Button>
            {modalMode !== 'view' && (
              <Button variant="primary" onClick={handleSalvar} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar Hóspede'}
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Hospedes;
