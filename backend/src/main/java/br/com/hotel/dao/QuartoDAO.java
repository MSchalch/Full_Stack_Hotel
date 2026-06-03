package br.com.hotel.dao;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Quarto;
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
}
