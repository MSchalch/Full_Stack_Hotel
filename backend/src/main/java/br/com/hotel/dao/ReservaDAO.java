package br.com.hotel.dao;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Reserva;
import br.com.hotel.dto.PageDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ReservaDAO implements IDAO {

    private EntityManager entityManager;

    public ReservaDAO(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public void salvar(EntidadeDominio entidade) {
        if (entidade instanceof Reserva) {
            entityManager.persist(entidade);
        }
    }

    @Override
    public void alterar(EntidadeDominio entidade) {
        if (entidade instanceof Reserva) {
            entityManager.merge(entidade);
        }
    }

    @Override
    public void deletar(EntidadeDominio entidade) {
        if (entidade instanceof Reserva) {
            entityManager.remove(entityManager.contains(entidade) ? entidade : entityManager.merge(entidade));
        }
    }

    @Override
    public List<EntidadeDominio> consultar(EntidadeDominio entidade) {
        String jpql = "SELECT r FROM Reserva r";
        TypedQuery<Reserva> query = entityManager.createQuery(jpql, Reserva.class);
        return (List<EntidadeDominio>) (List<?>) query.getResultList();
    }

    @Override
    public PageDTO<EntidadeDominio> consultarPaginado(EntidadeDominio entidade, int page, int size) {
        long totalElements = entityManager.createQuery("SELECT COUNT(r) FROM Reserva r", Long.class).getSingleResult();
        
        String jpql = "SELECT r FROM Reserva r ORDER BY r.id DESC";
        TypedQuery<Reserva> query = entityManager.createQuery(jpql, Reserva.class);
        query.setFirstResult(page * size);
        query.setMaxResults(size);
        
        return new PageDTO<>((List<EntidadeDominio>) (List<?>) query.getResultList(), totalElements, size, page);
    }
}
