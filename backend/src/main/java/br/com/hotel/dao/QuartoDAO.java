package br.com.hotel.dao;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Quarto;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.util.List;

public class QuartoDAO implements IDAO {

    private EntityManager entityManager;

    public QuartoDAO(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public void salvar(EntidadeDominio entidade) {
        if (entidade instanceof Quarto) {
            entityManager.persist(entidade);
        }
    }

    @Override
    public void alterar(EntidadeDominio entidade) {
        if (entidade instanceof Quarto) {
            entityManager.merge(entidade);
        }
    }

    @Override
    public void deletar(EntidadeDominio entidade) {
        if (entidade instanceof Quarto quarto) {
            // Em vez de deletar fisicamente, na maioria dos casos inativamos
            quarto.setAtivo(false);
            entityManager.merge(quarto);
        }
    }

    @Override
    public List<EntidadeDominio> consultar(EntidadeDominio entidade) {
        // Implementação simplificada buscando todos ativos
        String jpql = "SELECT q FROM Quarto q WHERE q.ativo = true";
        TypedQuery<Quarto> query = entityManager.createQuery(jpql, Quarto.class);
        return (List<EntidadeDominio>) (List<?>) query.getResultList();
    }
}
