package br.com.hotel.dao;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Promocao;
import br.com.hotel.dto.PageDTO;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PromocaoDAO implements IDAO {

    private final EntityManager entityManager;

    public PromocaoDAO(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public void salvar(EntidadeDominio entidade) {
        if (entidade instanceof Promocao prom) {
            entityManager.persist(prom);
        }
    }

    @Override
    public void alterar(EntidadeDominio entidade) {
        if (entidade instanceof Promocao prom) {
            entityManager.merge(prom);
        }
    }

    @Override
    public void deletar(EntidadeDominio entidade) {
        if (entidade instanceof Promocao prom && prom.getId() != null) {
            Promocao pDB = entityManager.find(Promocao.class, prom.getId());
            if (pDB != null) {
                entityManager.remove(pDB);
            }
        }
    }

    @Override
    public List<EntidadeDominio> consultar(EntidadeDominio entidade) {
        if (entidade instanceof Promocao prom) {
            String jpql = "SELECT p FROM Promocao p WHERE 1=1";
            if (prom.getId() != null) {
                jpql += " AND p.id = " + prom.getId();
            }
            return entityManager.createQuery(jpql, EntidadeDominio.class).getResultList();
        }
        return null;
    }

    @Override
    public PageDTO<EntidadeDominio> consultarPaginado(EntidadeDominio entidade, int page, int size) {
        if (entidade instanceof Promocao prom) {
            StringBuilder baseJpql = new StringBuilder("FROM Promocao p WHERE 1=1");
            if (prom.getId() != null) {
                baseJpql.append(" AND p.id = ").append(prom.getId());
            }

            long totalElements = entityManager.createQuery("SELECT COUNT(p) " + baseJpql.toString(), Long.class).getSingleResult();

            String fetchJpql = "SELECT p " + baseJpql.toString() + " ORDER BY p.id DESC";
            var query = entityManager.createQuery(fetchJpql, Promocao.class);
            query.setFirstResult(page * size);
            query.setMaxResults(size);

            return new PageDTO<>((List<EntidadeDominio>) (List<?>) query.getResultList(), totalElements, size, page);
        }
        return new PageDTO<>(List.of(), 0, size, page);
    }
}
