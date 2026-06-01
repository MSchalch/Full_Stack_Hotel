package br.com.hotel.dao;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Pagamento;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

import java.util.List;

public class PagamentoDAO implements IDAO {

    private EntityManager entityManager;

    public PagamentoDAO(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public void salvar(EntidadeDominio entidade) {
        if (entidade instanceof Pagamento) {
            entityManager.persist(entidade);
        }
    }

    @Override
    public void alterar(EntidadeDominio entidade) {
        if (entidade instanceof Pagamento) {
            entityManager.merge(entidade);
        }
    }

    @Override
    public void deletar(EntidadeDominio entidade) {
        if (entidade instanceof Pagamento) {
            entityManager.remove(entityManager.contains(entidade) ? entidade : entityManager.merge(entidade));
        }
    }

    @Override
    public List<EntidadeDominio> consultar(EntidadeDominio entidade) {
        String jpql = "SELECT p FROM Pagamento p";
        TypedQuery<Pagamento> query = entityManager.createQuery(jpql, Pagamento.class);
        return (List<EntidadeDominio>) (List<?>) query.getResultList();
    }
}
