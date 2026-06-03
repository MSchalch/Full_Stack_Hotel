package br.com.hotel.strategy;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Quarto;
import jakarta.persistence.EntityManager;
import java.util.List;

public class ValidarNumeroQuartoUnicoStrategy implements IStrategy {
    private EntityManager entityManager;

    public ValidarNumeroQuartoUnicoStrategy(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Quarto quarto && quarto.getNumero() != null) {
            String jpql = "SELECT q.id FROM Quarto q WHERE q.numero = :numero";
            List<Long> ids = entityManager.createQuery(jpql, Long.class)
                    .setParameter("numero", quarto.getNumero())
                    .getResultList();
            
            for (Long id : ids) {
                if (!id.equals(quarto.getId())) {
                    return "Já existe um quarto cadastrado com o número " + quarto.getNumero() + ".";
                }
            }
        }
        return null;
    }
}
