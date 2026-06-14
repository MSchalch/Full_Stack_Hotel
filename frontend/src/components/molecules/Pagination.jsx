import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';
import { useTranslation } from 'react-i18next';

const Pagination = ({ page, totalPages, onPageChange }) => {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  return (
    <div className="pagination-container">
      <button 
        className="pagination-btn" 
        disabled={page === 0} 
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft size={16} />
      </button>
      
      <span className="pagination-info">
        Página {page + 1} de {totalPages}
      </span>
      
      <button 
        className="pagination-btn" 
        disabled={page >= totalPages - 1} 
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
