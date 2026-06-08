package br.com.hotel.strategy;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Promocao;
import jakarta.persistence.EntityManager;

public class ValidarExclusaoPromocaoStrategy implements IStrategy {
    private EntityManager entityManager;

    public ValidarExclusaoPromocaoStrategy(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Promocao promocao && promocao.getId() != null) {
            String jpql = "SELECT count(r) FROM Reserva r WHERE r.promocao.id = :id";
            Long count = entityManager.createQuery(jpql, Long.class)
                    .setParameter("id", promocao.getId())
                    .getSingleResult();
            
            if (count > 0) {
                return "Não é possível excluir esta promoção. Ela possui " + count + " reserva(s) associada(s). Experimente inativá-la.";
            }
        }
        return null;
    }
}
