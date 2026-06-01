import React, { useState, useEffect } from 'react';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import Modal from '../components/molecules/Modal';
import { Search, Plus, MoreVertical } from 'lucide-react';
import api from '../services/api';
import './Hospedes.css';

const Hospedes = () => {
  const [hospedes, setHospedes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados do Modal e Formulário
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [erroForm, setErroForm] = useState(null);
  
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    cpf: '',
    dataNascimento: '',
    email: '',
    telefone: '',
    cep: '',
    logradouro: '',
    bairro: '',
    cidade: '',
    estado: '',
    numero: '',
    complemento: ''
  });

  useEffect(() => {
    carregarHospedes();
  }, []);

  const carregarHospedes = async () => {
    try {
      const response = await api.get('/hospedes');
      setHospedes(response.data || []);
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

  const handleSalvar = async () => {
    setSaving(true);
    setErroForm(null);
    try {
      const payload = {
        nomeCompleto: formData.nomeCompleto,
        cpf: formData.cpf,
        dataNascimento: formData.dataNascimento,
        telefone: formData.telefone,
        email: formData.email,
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

      await api.post('/hospedes', payload);
      
      setIsModalOpen(false);
      setFormData({
        nomeCompleto: '', cpf: '', dataNascimento: '', email: '', telefone: '', cep: '', numero: '', complemento: ''
      });
      carregarHospedes();
    } catch (error) {
      if (error.response && error.response.data) {
        const data = error.response.data;
        if (typeof data === 'string') {
          setErroForm(data);
        } else if (data.message) {
          setErroForm(data.message);
        } else {
          setErroForm("Ocorreu um erro ao processar a requisição.");
        }
      } else {
        setErroForm("Ocorreu um erro ao salvar o hóspede.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Gerenciar Hóspedes</h1>
          <p>Listagem e cadastro de hóspedes do hotel</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Novo Hóspede
        </Button>
      </div>

      <div className="filter-bar">
        <div style={{ flexGrow: 1, maxWidth: '400px' }}>
          <Input placeholder="Buscar hóspede por nome, CPF ou E-mail..." />
        </div>
        <Button variant="secondary">
          <Search size={18} /> Buscar
        </Button>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Nome Completo</th>
              <th>CPF</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{textAlign: 'center'}}>Carregando...</td></tr>
            ) : hospedes.length === 0 ? (
              <tr><td colSpan="4" style={{textAlign: 'center'}}>Nenhum hóspede encontrado.</td></tr>
            ) : (
              hospedes.map((hospede) => (
                <tr key={hospede.id}>
                  <td>{hospede.nomeCompleto}</td>
                  <td>{hospede.cpf}</td>
                  <td>
                    <span className={`badge ${hospede.ativo ? 'badge-active' : 'badge-inactive'}`}>
                      {hospede.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td><button className="icon-btn"><MoreVertical size={18} /></button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Cadastro */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Hóspede">
        {erroForm && (
          <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '8px', fontSize: '14px', whiteSpace: 'pre-line' }}>
            {erroForm}
          </div>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Nome Completo" name="nomeCompleto" value={formData.nomeCompleto} onChange={handleChange} placeholder="João da Silva" />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input label="CPF" name="cpf" value={formData.cpf} onChange={handleChange} placeholder="Apenas números" />
            <Input label="Data de Nascimento" type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input label="E-mail" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="joao@email.com" />
            <Input label="Telefone" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="(11) 99999-9999" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input label="CEP" name="cep" value={formData.cep} onChange={handleChange} placeholder="00000-000" />
            <Input label="Número" name="numero" value={formData.numero} onChange={handleChange} placeholder="123" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input label="Logradouro" name="logradouro" value={formData.logradouro} readOnly disabled placeholder="Rua..." />
            <Input label="Bairro" name="bairro" value={formData.bairro} readOnly disabled placeholder="Bairro..." />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <Input label="Cidade" name="cidade" value={formData.cidade} readOnly disabled />
            <Input label="UF" name="estado" value={formData.estado} readOnly disabled />
            <Input label="Complemento" name="complemento" value={formData.complemento} onChange={handleChange} placeholder="Apto 45" />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleSalvar} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Hóspede'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Hospedes;
