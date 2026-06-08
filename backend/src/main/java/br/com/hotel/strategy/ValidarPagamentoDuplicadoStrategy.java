package br.com.hotel.strategy;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Pagamento;
import br.com.hotel.domain.StatusPagamento;
import jakarta.persistence.EntityManager;

public class ValidarPagamentoDuplicadoStrategy implements IStrategy {
    
    private EntityManager entityManager;

    public ValidarPagamentoDuplicadoStrategy(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Pagamento pagamento && pagamento.getReserva() != null && pagamento.getReserva().getId() != null) {
            
            // Só valida duplicação se for um novo pagamento (sem ID) e que está tentando entrar como APROVADO
            if (pagamento.getId() == null && pagamento.getStatusPagamento() == StatusPagamento.APROVADO) {
                String jpql = "SELECT count(p) FROM Pagamento p WHERE p.reserva.id = :reservaId AND p.statusPagamento = :status";
                Long qtd = entityManager.createQuery(jpql, Long.class)
                        .setParameter("reservaId", pagamento.getReserva().getId())
                        .setParameter("status", StatusPagamento.APROVADO)
                        .getSingleResult();
                
                if (qtd > 0) {
                    return "Esta reserva já possui um pagamento aprovado.";
                }
            }
        }
        return null;
    }
}
