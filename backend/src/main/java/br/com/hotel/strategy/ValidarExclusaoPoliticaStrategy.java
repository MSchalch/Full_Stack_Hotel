package br.com.hotel.strategy;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.PoliticaCancelamento;
import jakarta.persistence.EntityManager;

public class ValidarExclusaoPoliticaStrategy implements IStrategy {
    private EntityManager entityManager;

    public ValidarExclusaoPoliticaStrategy(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof PoliticaCancelamento pol && pol.getId() != null) {
            String jpql = "SELECT count(r) FROM Reserva r WHERE r.politicaCancelamento.id = :id";
            Long count = entityManager.createQuery(jpql, Long.class)
                    .setParameter("id", pol.getId())
                    .getSingleResult();
            
            if (count > 0) {
                return "Não é possível excluir a política. Ela está ligada a " + count + " reserva(s) no sistema. Experimente inativá-la.";
            }
        }
        return null;
    }
}
