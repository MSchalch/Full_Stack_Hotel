package br.com.hotel.dao;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.PoliticaCancelamento;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

import java.util.List;

public class PoliticaCancelamentoDAO implements IDAO {

    private EntityManager entityManager;

    public PoliticaCancelamentoDAO(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public void salvar(EntidadeDominio entidade) {
        if (entidade instanceof PoliticaCancelamento) {
            entityManager.persist(entidade);
        }
    }

    @Override
    public void alterar(EntidadeDominio entidade) {
        if (entidade instanceof PoliticaCancelamento) {
            entityManager.merge(entidade);
        }
    }

    @Override
    public void deletar(EntidadeDominio entidade) {
        if (entidade instanceof PoliticaCancelamento pol) {
            pol.setAtivo(false);
            entityManager.merge(pol);
        }
    }

    @Override
    public List<EntidadeDominio> consultar(EntidadeDominio entidade) {
        String jpql = "SELECT p FROM PoliticaCancelamento p WHERE p.ativo = true";
        TypedQuery<PoliticaCancelamento> query = entityManager.createQuery(jpql, PoliticaCancelamento.class);
        return (List<EntidadeDominio>) (List<?>) query.getResultList();
    }
}
