package br.com.hotel.dao;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Quarto;
import br.com.hotel.dto.PageDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
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
        if (entidade instanceof Quarto quarto && quarto.getId() != null) {
            Quarto qDB = entityManager.find(Quarto.class, quarto.getId());
            if (qDB != null) {
                entityManager.remove(qDB);
            }
        }
    }

    @Override
    public List<EntidadeDominio> consultar(EntidadeDominio entidade) {
        if (entidade instanceof Quarto q) {
            StringBuilder jpql = new StringBuilder("SELECT q FROM Quarto q WHERE 1=1");
            if (q.getNumero() != null) {
                jpql.append(" AND CAST(q.numero AS string) LIKE :numero");
            }
            jpql.append(" ORDER BY q.numero");
            
            var query = entityManager.createQuery(jpql.toString(), Quarto.class);
            if (q.getNumero() != null) {
                query.setParameter("numero", "%" + q.getNumero() + "%");
            }
            return (List<EntidadeDominio>) (List<?>) query.getResultList();
        }
        return List.of();
    }

    @Override
    public PageDTO<EntidadeDominio> consultarPaginado(EntidadeDominio entidade, int page, int size) {
        if (entidade instanceof Quarto q) {
            StringBuilder baseJpql = new StringBuilder("FROM Quarto q WHERE 1=1");
            if (q.getNumero() != null) {
                baseJpql.append(" AND CAST(q.numero AS string) LIKE :numero");
            }
            
            TypedQuery<Long> countQuery = entityManager.createQuery("SELECT COUNT(q) " + baseJpql.toString(), Long.class);
            if (q.getNumero() != null) {
                countQuery.setParameter("numero", "%" + q.getNumero() + "%");
            }
            long totalElements = countQuery.getSingleResult();

            String fetchJpql = "SELECT q " + baseJpql.toString() + " ORDER BY q.numero";
            TypedQuery<Quarto> query = entityManager.createQuery(fetchJpql, Quarto.class);
            if (q.getNumero() != null) {
                query.setParameter("numero", "%" + q.getNumero() + "%");
            }
            
            query.setFirstResult(page * size);
            query.setMaxResults(size);
            
            return new PageDTO<>((List<EntidadeDominio>) (List<?>) query.getResultList(), totalElements, size, page);
        }
        return new PageDTO<>(List.of(), 0, size, page);
    }
}
