import React from 'react';
import Button from '../components/atoms/Button';
import { Download, FileText } from 'lucide-react';
import './Hospedes.css';

const Relatorios = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Relatórios</h1>
          <p>Exportação de dados gerenciais e financeiros</p>
        </div>
      </div>

      <div className="table-container" style={{ marginTop: '20px' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Tipo de Relatório</th>
              <th>Formato</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><FileText size={16} style={{verticalAlign: 'middle', marginRight: '8px', color: 'var(--color-primary)'}}/> Ocupação Mensal</td>
              <td>PDF / Excel</td>
              <td>
                <Button variant="secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                  <Download size={14} /> Gerar
                </Button>
              </td>
            </tr>
            <tr>
              <td><FileText size={16} style={{verticalAlign: 'middle', marginRight: '8px', color: 'var(--color-primary)'}}/> Faturamento Anual</td>
              <td>PDF / Excel</td>
              <td>
                <Button variant="secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                  <Download size={14} /> Gerar
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Relatorios;
