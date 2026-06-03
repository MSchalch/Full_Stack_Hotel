package br.com.hotel.strategy;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Quarto;
import jakarta.persistence.EntityManager;

public class ValidarExclusaoQuartoStrategy implements IStrategy {
    private EntityManager entityManager;

    public ValidarExclusaoQuartoStrategy(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Quarto quarto && quarto.getId() != null) {
            // Conta quantas reservas estão vinculadas ao quarto
            String jpql = "SELECT count(r) FROM Reserva r WHERE r.quarto.id = :id";
            Long count = entityManager.createQuery(jpql, Long.class)
                    .setParameter("id", quarto.getId())
                    .getSingleResult();
            
            if (count > 0) {
                return "Não é possível excluir o quarto. Ele possui " + count + " reserva(s) em seu histórico. Experimente inativá-lo.";
            }
        }
        return null;
    }
}
