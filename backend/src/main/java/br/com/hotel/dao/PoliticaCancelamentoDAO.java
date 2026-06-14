package br.com.hotel.dao;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.PoliticaCancelamento;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
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
        if (entidade instanceof PoliticaCancelamento pol && pol.getId() != null) {
            PoliticaCancelamento pDB = entityManager.find(PoliticaCancelamento.class, pol.getId());
            if (pDB != null) {
                entityManager.remove(pDB);
            }
        }
    }

    @Override
    public List<EntidadeDominio> consultar(EntidadeDominio entidade) {
        String jpql = "SELECT p FROM PoliticaCancelamento p";
        TypedQuery<PoliticaCancelamento> query = entityManager.createQuery(jpql, PoliticaCancelamento.class);
        return (List<EntidadeDominio>) (List<?>) query.getResultList();
    }
}
