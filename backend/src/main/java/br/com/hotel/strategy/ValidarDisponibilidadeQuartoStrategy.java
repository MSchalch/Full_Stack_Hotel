package br.com.hotel.strategy;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Reserva;
import jakarta.persistence.EntityManager;

public class ValidarDisponibilidadeQuartoStrategy implements IStrategy {
    private EntityManager entityManager;

    public ValidarDisponibilidadeQuartoStrategy(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Reserva reserva && reserva.getQuarto() != null 
            && reserva.getCheckIn() != null && reserva.getCheckOut() != null) {
            
            // Query para checar se o quarto já está reservado nestas datas
            String jpql = "SELECT COUNT(r) FROM Reserva r WHERE r.quarto.id = :quartoId " +
                          "AND r.status IN ('CONFIRMADA', 'ESTADIA') " +
                          "AND ((r.checkIn < :checkOut) AND (r.checkOut > :checkIn)) ";
            
            // Se for uma alteração, precisamos ignorar a própria reserva
            if (reserva.getId() != null) {
                jpql += "AND r.id != :reservaId";
            }
            
            var query = entityManager.createQuery(jpql, Long.class)
                .setParameter("quartoId", reserva.getQuarto().getId())
                .setParameter("checkIn", reserva.getCheckIn())
                .setParameter("checkOut", reserva.getCheckOut());

            if (reserva.getId() != null) {
                query.setParameter("reservaId", reserva.getId());
            }

            Long conflitos = query.getSingleResult();
            
            if (conflitos > 0) {
                return "O quarto selecionado não está disponível para o período escolhido.";
            }
        }
        return null;
    }
}
