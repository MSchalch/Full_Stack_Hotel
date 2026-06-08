package br.com.hotel.strategy;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Pagamento;
import br.com.hotel.domain.Reserva;
import br.com.hotel.domain.StatusPagamento;
import br.com.hotel.domain.StatusReserva;
import jakarta.persistence.EntityManager;

public class AtualizarStatusReservaPagamentoStrategy implements IStrategy {
    
    private EntityManager entityManager;

    public AtualizarStatusReservaPagamentoStrategy(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Pagamento pagamento && pagamento.getReserva() != null && pagamento.getReserva().getId() != null) {
            
            Reserva reserva = entityManager.find(Reserva.class, pagamento.getReserva().getId());
            if (reserva == null) {
                return "Reserva não encontrada para atualizar status.";
            }

            if (pagamento.getStatusPagamento() == StatusPagamento.APROVADO) {
                if (reserva.getStatus() == StatusReserva.PROPOSTA || reserva.getStatus() == StatusReserva.CANCELADA) {
                    reserva.setStatus(StatusReserva.CONFIRMADA);
                    entityManager.merge(reserva);
                }
            } else if (pagamento.getStatusPagamento() == StatusPagamento.ESTORNADO) {
                if (reserva.getStatus() == StatusReserva.CONFIRMADA || reserva.getStatus() == StatusReserva.PROPOSTA) {
                    reserva.setStatus(StatusReserva.CANCELADA);
                    entityManager.merge(reserva);
                }
            }
        }
        return null;
    }
}
