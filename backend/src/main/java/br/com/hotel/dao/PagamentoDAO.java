package br.com.hotel.dao;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Pagamento;
import br.com.hotel.dto.PageDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
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

    @Override
    public PageDTO<EntidadeDominio> consultarPaginado(EntidadeDominio entidade, int page, int size) {
        long totalElements = entityManager.createQuery("SELECT COUNT(p) FROM Pagamento p", Long.class).getSingleResult();
        
        String jpql = "SELECT p FROM Pagamento p ORDER BY p.id DESC";
        TypedQuery<Pagamento> query = entityManager.createQuery(jpql, Pagamento.class);
        query.setFirstResult(page * size);
        query.setMaxResults(size);
        
        return new PageDTO<>((List<EntidadeDominio>) (List<?>) query.getResultList(), totalElements, size, page);
    }
}
