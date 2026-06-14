import React from 'react';
import Button from '../components/atoms/Button';
import { Download, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Hospedes.css';

const Relatorios = () => {
  const { t } = useTranslation();
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>{t('relatorios.title')}</h1>
          <p>{t('relatorios.subtitle')}</p>
        </div>
      </div>

      <div className="table-container" style={{ marginTop: '20px' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>{t('relatorios.table.type')}</th>
              <th>{t('relatorios.table.format')}</th>
              <th>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><FileText size={16} style={{verticalAlign: 'middle', marginRight: '8px', color: 'var(--color-primary)'}}/> {t('relatorios.occupancy')}</td>
              <td>PDF / Excel</td>
              <td>
                <Button variant="secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                  <Download size={14} /> {t('relatorios.generate')}
                </Button>
              </td>
            </tr>
            <tr>
              <td><FileText size={16} style={{verticalAlign: 'middle', marginRight: '8px', color: 'var(--color-primary)'}}/> {t('relatorios.revenue')}</td>
              <td>PDF / Excel</td>
              <td>
                <Button variant="secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                  <Download size={14} /> {t('relatorios.generate')}
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
