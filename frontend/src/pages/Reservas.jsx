import React, { useState, useEffect } from 'react';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import Modal from '../components/molecules/Modal';
import { Search, Plus, MoreVertical, Calendar, CheckCircle, XCircle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import './Hospedes.css';

const Reservas = () => {
  const { t } = useTranslation();
  const [reservas, setReservas] = useState([]);
  const [hospedes, setHospedes] = useState([]);
  const [quartos, setQuartos] = useState([]);
  const [politicas, setPoliticas] = useState([]);
  const [promocoes, setPromocoes] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [erroForm, setErroForm] = useState(null);
  const [showHospedeDropdown, setShowHospedeDropdown] = useState(false);
  const [showQuartoDropdown, setShowQuartoDropdown] = useState(false);
  const [showAcompanhanteAdultoDropdown, setShowAcompanhanteAdultoDropdown] = useState(false);
  const [showAcompanhanteCriancaDropdown, setShowAcompanhanteCriancaDropdown] = useState(false);
  const [acompanhanteAdultoBusca, setAcompanhanteAdultoBusca] = useState('');
  const [acompanhanteCriancaBusca, setAcompanhanteCriancaBusca] = useState('');

  const [formData, setFormData] = useState({
    id: null,
    hospedeId: '',
    hospedeNomeBusca: '',
    acompanhantes: [],
    quartoId: '',
    quartoNomeBusca: '',
    checkIn: '',
    checkOut: '',
    quantAdultos: 1,
    quantCriancas: 0,
    politicaCancelamentoId: '',
    promocaoId: '',
    status: 'PROPOSTA'
  });

  useEffect(() => {
    carregarDadosBase();
    carregarReservas();
  }, []);

  const carregarDadosBase = async () => {
    try {
      const [respHospedes, respQuartos, respPoliticas, respPromocoes] = await Promise.all([
        api.get('/hospedes'),
        api.get('/quartos'),
        api.get('/politicas-cancelamento'),
        api.get('/promocoes')
      ]);
      setHospedes(respHospedes.data || []);
      setQuartos(respQuartos.data || []);
      setPoliticas(respPoliticas.data || []);
      setPromocoes(respPromocoes.data || []);
    } catch (error) {
      console.error("Erro ao carregar dados base:", error);
    }
  };

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

  const formatarDataLocal = (dataStr) => {
    if (!dataStr) return '';
    return new Date(dataStr).toISOString().slice(0, 16); // Formato para input datetime-local
  };

  const calcularIdade = (dataString) => {
    if (!dataString) return 0;
    const hoje = new Date();
    const dataNascimento = new Date(dataString);
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const m = hoje.getMonth() - dataNascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < dataNascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  const handleNovo = () => {
    setModalMode('create');
    setFormData({
      id: null,
      hospedeId: '',
      hospedeNomeBusca: '',
      acompanhantes: [],
      quartoId: '',
      quartoNomeBusca: '',
      checkIn: '',
      checkOut: '',
      quantAdultos: 1,
      quantCriancas: 0,
      politicaCancelamentoId: '',
      promocaoId: '',
      status: 'PROPOSTA'
    });
    setErroForm(null);
    setIsModalOpen(true);
  };

  const handleEditar = (reserva) => {
    setModalMode('edit');
    setFormData({
      id: reserva.id,
      hospedeId: reserva.hospede ? reserva.hospede.id : '',
      hospedeNomeBusca: reserva.hospede ? `${reserva.hospede.nomeCompleto} - ${reserva.hospede.cpf}` : '',
      acompanhantes: reserva.acompanhantes ? reserva.acompanhantes.map(a => a.id) : [],
      quartoId: reserva.quarto ? reserva.quarto.id : '',
      quartoNomeBusca: reserva.quarto ? `Nº ${reserva.quarto.numero} (${reserva.quarto.tipoQuarto}) - R$ ${reserva.quarto.precoBase}` : '',
      checkIn: formatarDataLocal(reserva.checkIn),
      checkOut: formatarDataLocal(reserva.checkOut),
      quantAdultos: reserva.quantAdultos || 1,
      quantCriancas: reserva.quantCriancas || 0,
      politicaCancelamentoId: reserva.politicaCancelamento ? reserva.politicaCancelamento.id : '',
      promocaoId: reserva.promocao ? reserva.promocao.id : '',
      status: reserva.status || 'PROPOSTA'
    });
    setErroForm(null);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAcompanhanteCheckboxChange = (id, checked) => {
    setFormData(prev => {
      if (checked) {
        return { ...prev, acompanhantes: [...prev.acompanhantes, id] };
      } else {
        return { ...prev, acompanhantes: prev.acompanhantes.filter(item => item !== id) };
      }
    });
  };

  const totalAdultos = (formData.hospedeId ? 1 : 0) + formData.acompanhantes.filter(id => {
    const h = hospedes.find(h => h.id === id);
    return h && calcularIdade(h.dataNascimento) > 10;
  }).length;

  const totalCriancas = formData.acompanhantes.filter(id => {
    const h = hospedes.find(h => h.id === id);
    return h && calcularIdade(h.dataNascimento) <= 10;
  }).length;

  const handleSalvar = async () => {
    try {
      setErroForm(null);
      const payload = {
        id: formData.id,
        status: formData.status,
        checkIn: formData.checkIn ? new Date(formData.checkIn).toISOString() : null,
        checkOut: formData.checkOut ? new Date(formData.checkOut).toISOString() : null,
        quantAdultos: totalAdultos,
        quantCriancas: totalCriancas,
        hospede: formData.hospedeId ? { id: parseInt(formData.hospedeId) } : null,
        quarto: formData.quartoId ? { id: parseInt(formData.quartoId) } : null,
        politicaCancelamento: formData.politicaCancelamentoId ? { id: parseInt(formData.politicaCancelamentoId) } : null,
        promocao: formData.promocaoId ? { id: parseInt(formData.promocaoId) } : null,
        acompanhantes: formData.acompanhantes.map(id => ({ id }))
      };

      if (modalMode === 'create') {
        await api.post('/reservas', payload);
      } else {
        await api.put('/reservas', payload);
      }
      setIsModalOpen(false);
      carregarReservas();
    } catch (err) {
      if (err.response && err.response.data && typeof err.response.data === 'string') {
        setErroForm(err.response.data);
      } else {
        setErroForm("Ocorreu um erro inesperado. Verifique os dados.");
      }
    }
  };

  const formatarData = (dataStr) => {
    if(!dataStr) return '-';
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h2>{t('reservas.title')}</h2>
          <p>{t('reservas.subtitle')}</p>
        </div>
        <Button variant="primary" onClick={handleNovo}>
          <Plus size={18} /> {t('reservas.new')}
        </Button>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>{t('reservas.table.guest')}</th>
              <th>{t('reservas.table.room')}</th>
              <th>{t('reservas.table.period')}</th>
              <th>{t('reservas.modal.guest_adults')}</th>
              <th>{t('reservas.table.value')}</th>
              <th>{t('common.status')}</th>
              <th style={{ textAlign: 'center' }}>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" style={{textAlign: 'center'}}>{t('common.loading')}</td></tr>
            ) : reservas.length === 0 ? (
              <tr><td colSpan="8" style={{textAlign: 'center'}}>{t('reservas.not_found')}</td></tr>
            ) : (
              reservas.map((reserva) => (
                <tr key={reserva.id}>
                  <td><strong>#{reserva.id}</strong></td>
                  <td>{reserva.hospede?.nomeCompleto || 'Desconhecido'}</td>
                  <td>Quarto {reserva.quarto?.numero || 'N/A'}</td>
                  <td style={{ fontSize: '13px' }}>
                    <div><Calendar size={12} style={{marginRight: '4px'}}/> In: {formatarData(reserva.checkIn)}</div>
                    <div><Calendar size={12} style={{marginRight: '4px'}}/> Out: {formatarData(reserva.checkOut)}</div>
                  </td>
                  <td>{reserva.acompanhantes?.length || 0} pessoa(s)</td>
                  <td><strong>R$ {reserva.valorTotal ? reserva.valorTotal.toFixed(2).replace('.', ',') : '0,00'}</strong></td>
                  <td><span className={`badge ${reserva.status === 'CONFIRMADA' ? 'badge-active' : (reserva.status === 'PROPOSTA' ? 'badge-warning' : 'badge-inactive')}`}>{reserva.status}</span></td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <button className="icon-btn edit-btn" title="Editar" onClick={() => handleEditar(reserva)}>
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'create' ? t('reservas.modal.new') : t('reservas.modal.edit')}>
        {erroForm && (
          <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '8px', fontSize: '14px', whiteSpace: 'pre-line', marginBottom: '16px' }}>
            {erroForm}
          </div>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
              <label style={{ fontSize: '14px', fontWeight: '500' }}>{t('reservas.modal.guest_main')}</label>
              <Input 
                placeholder="Busque por nome ou CPF..."
                value={formData.hospedeNomeBusca}
                onChange={(e) => setFormData(prev => ({...prev, hospedeNomeBusca: e.target.value, hospedeId: ''}))}
                onFocus={() => setShowHospedeDropdown(true)}
                onBlur={() => setTimeout(() => setShowHospedeDropdown(false), 200)}
              />
              {showHospedeDropdown && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', maxHeight: '150px', overflowY: 'auto', zIndex: 10, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                  {hospedes.filter(h => (h.nomeCompleto.toLowerCase().includes((formData.hospedeNomeBusca||'').toLowerCase()) || h.cpf.includes(formData.hospedeNomeBusca||'')) && calcularIdade(h.dataNascimento) >= 18).length === 0 && (
                     <div style={{ padding: '8px 12px', color: 'var(--color-text-muted)' }}>Nenhum hóspede adulto encontrado</div>
                  )}
                  {hospedes.filter(h => (h.nomeCompleto.toLowerCase().includes((formData.hospedeNomeBusca||'').toLowerCase()) || h.cpf.includes(formData.hospedeNomeBusca||'')) && calcularIdade(h.dataNascimento) >= 18).map(h => (
                    <div 
                      key={h.id} 
                      style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-main)' }}
                      onClick={() => {
                        setFormData(prev => ({...prev, hospedeId: h.id.toString(), hospedeNomeBusca: `${h.nomeCompleto} - ${h.cpf}`}));
                        setShowHospedeDropdown(false);
                      }}
                    >
                      {h.nomeCompleto} - {h.cpf}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
              <label style={{ fontSize: '14px', fontWeight: '500' }}>{t('reservas.modal.room')}</label>
              <Input 
                placeholder="Busque por número ou tipo..."
                value={formData.quartoNomeBusca}
                onChange={(e) => setFormData(prev => ({...prev, quartoNomeBusca: e.target.value, quartoId: ''}))}
                onFocus={() => setShowQuartoDropdown(true)}
                onBlur={() => setTimeout(() => setShowQuartoDropdown(false), 200)}
              />
              {showQuartoDropdown && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', maxHeight: '150px', overflowY: 'auto', zIndex: 10, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                  {quartos.filter(q => q.ativo && (q.numero.toString().includes(formData.quartoNomeBusca||'') || q.tipoQuarto.toLowerCase().includes((formData.quartoNomeBusca||'').toLowerCase()))).length === 0 && (
                     <div style={{ padding: '8px 12px', color: 'var(--color-text-muted)' }}>Nenhum quarto encontrado</div>
                  )}
                  {quartos.filter(q => q.ativo && (q.numero.toString().includes(formData.quartoNomeBusca||'') || q.tipoQuarto.toLowerCase().includes((formData.quartoNomeBusca||'').toLowerCase()))).map(q => (
                    <div 
                      key={q.id} 
                      style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-main)' }}
                      onClick={() => {
                        setFormData(prev => ({...prev, quartoId: q.id.toString(), quartoNomeBusca: `Nº ${q.numero} (${q.tipoQuarto}) - R$ ${q.precoBase}`}));
                        setShowQuartoDropdown(false);
                      }}
                    >
                      Nº {q.numero} ({q.tipoQuarto}) - R$ {q.precoBase}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input 
              label={t('reservas.modal.checkin')} 
              name="checkIn" 
              type="datetime-local" 
              value={formData.checkIn} 
              onChange={handleChange} 
            />
            <Input 
              label={t('reservas.modal.checkout')} 
              name="checkOut" 
              type="datetime-local" 
              value={formData.checkOut} 
              onChange={handleChange} 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input 
              label={t('reservas.modal.qnt_adults')} 
              name="quantAdultos" 
              type="number" 
              value={totalAdultos} 
              readOnly 
              style={{ backgroundColor: 'var(--color-bg-dark)', color: 'var(--color-text-muted)', cursor: 'not-allowed' }}
            />
            <Input 
              label={t('reservas.modal.qnt_kids')} 
              name="quantCriancas" 
              type="number" 
              value={totalCriancas} 
              readOnly 
              style={{ backgroundColor: 'var(--color-bg-dark)', color: 'var(--color-text-muted)', cursor: 'not-allowed' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
              <label style={{ fontSize: '14px', fontWeight: '500' }}>{t('reservas.modal.guest_adults')}</label>
              <Input 
                placeholder="Buscar por nome ou CPF..."
                value={acompanhanteAdultoBusca}
                onChange={(e) => setAcompanhanteAdultoBusca(e.target.value)}
                onFocus={() => setShowAcompanhanteAdultoDropdown(true)}
                onBlur={() => setTimeout(() => setShowAcompanhanteAdultoDropdown(false), 200)}
              />
              {showAcompanhanteAdultoDropdown && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', maxHeight: '150px', overflowY: 'auto', zIndex: 10, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                  {hospedes.filter(h => h.id.toString() !== formData.hospedeId && !formData.acompanhantes.includes(h.id) && calcularIdade(h.dataNascimento) > 10 && (h.nomeCompleto.toLowerCase().includes(acompanhanteAdultoBusca.toLowerCase()) || h.cpf.includes(acompanhanteAdultoBusca))).length === 0 && (
                     <div style={{ padding: '8px 12px', color: 'var(--color-text-muted)' }}>Nenhum acompanhante encontrado</div>
                  )}
                  {hospedes.filter(h => h.id.toString() !== formData.hospedeId && !formData.acompanhantes.includes(h.id) && calcularIdade(h.dataNascimento) > 10 && (h.nomeCompleto.toLowerCase().includes(acompanhanteAdultoBusca.toLowerCase()) || h.cpf.includes(acompanhanteAdultoBusca))).map(h => (
                    <div 
                      key={h.id} 
                      style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-main)' }}
                      onClick={() => {
                        setFormData(prev => ({...prev, acompanhantes: [...prev.acompanhantes, h.id]}));
                        setAcompanhanteAdultoBusca('');
                        setShowAcompanhanteAdultoDropdown(false);
                      }}
                    >
                      {h.nomeCompleto} - {h.cpf}
                    </div>
                  ))}
                </div>
              )}
              {formData.acompanhantes.filter(id => { const h = hospedes.find(h=>h.id===id); return h && calcularIdade(h.dataNascimento) > 10; }).length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                  {formData.acompanhantes.filter(id => { const h = hospedes.find(h=>h.id===id); return h && calcularIdade(h.dataNascimento) > 10; }).map(id => {
                    const h = hospedes.find(h => h.id === id);
                    if (!h) return null;
                    return (
                      <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--color-border)', color: 'var(--color-text-main)', padding: '4px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: '500' }}>
                        {h.nomeCompleto.split(' ')[0]}
                        <X 
                          size={14} 
                          style={{ cursor: 'pointer', opacity: 0.7 }} 
                          onClick={() => setFormData(prev => ({...prev, acompanhantes: prev.acompanhantes.filter(aid => aid !== id)}))}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
              <label style={{ fontSize: '14px', fontWeight: '500' }}>{t('reservas.modal.guest_kids')}</label>
              <Input 
                placeholder="Buscar por nome ou CPF..."
                value={acompanhanteCriancaBusca}
                onChange={(e) => setAcompanhanteCriancaBusca(e.target.value)}
                onFocus={() => setShowAcompanhanteCriancaDropdown(true)}
                onBlur={() => setTimeout(() => setShowAcompanhanteCriancaDropdown(false), 200)}
              />
              {showAcompanhanteCriancaDropdown && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', maxHeight: '150px', overflowY: 'auto', zIndex: 10, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                  {hospedes.filter(h => h.id.toString() !== formData.hospedeId && !formData.acompanhantes.includes(h.id) && calcularIdade(h.dataNascimento) <= 10 && (h.nomeCompleto.toLowerCase().includes(acompanhanteCriancaBusca.toLowerCase()) || h.cpf.includes(acompanhanteCriancaBusca))).length === 0 && (
                     <div style={{ padding: '8px 12px', color: 'var(--color-text-muted)' }}>Nenhuma criança encontrada</div>
                  )}
                  {hospedes.filter(h => h.id.toString() !== formData.hospedeId && !formData.acompanhantes.includes(h.id) && calcularIdade(h.dataNascimento) <= 10 && (h.nomeCompleto.toLowerCase().includes(acompanhanteCriancaBusca.toLowerCase()) || h.cpf.includes(acompanhanteCriancaBusca))).map(h => (
                    <div 
                      key={h.id} 
                      style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-main)' }}
                      onClick={() => {
                        setFormData(prev => ({...prev, acompanhantes: [...prev.acompanhantes, h.id]}));
                        setAcompanhanteCriancaBusca('');
                        setShowAcompanhanteCriancaDropdown(false);
                      }}
                    >
                      {h.nomeCompleto} - {h.cpf}
                    </div>
                  ))}
                </div>
              )}
              {formData.acompanhantes.filter(id => { const h = hospedes.find(h=>h.id===id); return h && calcularIdade(h.dataNascimento) <= 10; }).length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                  {formData.acompanhantes.filter(id => { const h = hospedes.find(h=>h.id===id); return h && calcularIdade(h.dataNascimento) <= 10; }).map(id => {
                    const h = hospedes.find(h => h.id === id);
                    if (!h) return null;
                    return (
                      <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--color-border)', color: 'var(--color-text-main)', padding: '4px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: '500' }}>
                        {h.nomeCompleto.split(' ')[0]}
                        <X 
                          size={14} 
                          style={{ cursor: 'pointer', opacity: 0.7 }} 
                          onClick={() => setFormData(prev => ({...prev, acompanhantes: prev.acompanhantes.filter(aid => aid !== id)}))}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500' }}>{t('reservas.modal.policy')}</label>
              <select className="input-field" name="politicaCancelamentoId" value={formData.politicaCancelamentoId} onChange={handleChange}>
                <option value="">Selecione uma política...</option>
                {politicas.filter(p => p.ativo).map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500' }}>{t('reservas.modal.promo')}</label>
              <select className="input-field" name="promocaoId" value={formData.promocaoId} onChange={handleChange}>
                <option value="">Sem promoção</option>
                {promocoes.filter(p => p.ativo).map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>{t('reservas.modal.status')}</label>
            <select className="input-field" name="status" value={formData.status} onChange={handleChange}>
              <option value="PROPOSTA">PROPOSTA (Aguardando Pagamento)</option>
              <option value="CANCELADA">CANCELADA</option>
              <option value="ESTADIA">ESTADIA (Check-in Realizado)</option>
              <option value="CHECKOUT">CHECKOUT (Finalizada)</option>
              <option value="NO_SHOW">NO SHOW</option>
            </select>
          </div>
          
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>{t('common.cancel')}</Button>
          <Button variant="primary" onClick={handleSalvar}>{t('common.save')}</Button>
        </div>
      </Modal>

    </div>
  );
};

export default Reservas;
