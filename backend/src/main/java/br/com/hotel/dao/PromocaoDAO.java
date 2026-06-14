package br.com.hotel.dao;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Promocao;
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
}
