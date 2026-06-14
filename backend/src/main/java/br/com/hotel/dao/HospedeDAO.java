package br.com.hotel.dao;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Hospede;
import br.com.hotel.dto.PageDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class HospedeDAO implements IDAO {

    private EntityManager entityManager;

    public HospedeDAO(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public void salvar(EntidadeDominio entidade) {
        if (entidade instanceof Hospede) {
            entityManager.persist(entidade);
        }
    }

    @Override
    public void alterar(EntidadeDominio entidade) {
        if (entidade instanceof Hospede) {
            entityManager.merge(entidade);
        }
    }

    @Override
    public void deletar(EntidadeDominio entidade) {
        if (entidade instanceof Hospede) {
            Hospede hospede = entityManager.find(Hospede.class, entidade.getId());
            if (hospede != null) {
                entityManager.remove(hospede);
            }
        }
    }

    @Override
    public List<EntidadeDominio> consultar(EntidadeDominio entidade) {
        if (entidade instanceof Hospede hospedeFiltro) {
            StringBuilder jpql = new StringBuilder("SELECT h FROM Hospede h WHERE 1=1 ");
            
            if (hospedeFiltro.getNomeCompleto() != null && !hospedeFiltro.getNomeCompleto().trim().isEmpty()) {
                jpql.append("AND (LOWER(h.nomeCompleto) LIKE LOWER(CONCAT('%', :termo, '%')) ");
                jpql.append("OR h.cpf LIKE CONCAT('%', :termo, '%') ");
                jpql.append("OR LOWER(h.email) LIKE LOWER(CONCAT('%', :termo, '%'))) ");
            }
            jpql.append("ORDER BY h.ativo DESC, h.nomeCompleto ASC");

            TypedQuery<Hospede> query = entityManager.createQuery(jpql.toString(), Hospede.class);

            if (hospedeFiltro.getNomeCompleto() != null && !hospedeFiltro.getNomeCompleto().trim().isEmpty()) {
                query.setParameter("termo", hospedeFiltro.getNomeCompleto());
            }

            return (List<EntidadeDominio>) (List<?>) query.getResultList();
        }
        
        return (List<EntidadeDominio>) (List<?>) entityManager.createQuery("SELECT h FROM Hospede h ORDER BY h.ativo DESC, h.nomeCompleto ASC", Hospede.class).getResultList();
    }

    @Override
    public PageDTO<EntidadeDominio> consultarPaginado(EntidadeDominio entidade, int page, int size) {
        if (entidade instanceof Hospede hospedeFiltro) {
            StringBuilder baseJpql = new StringBuilder("FROM Hospede h WHERE 1=1 ");
            
            if (hospedeFiltro.getNomeCompleto() != null && !hospedeFiltro.getNomeCompleto().trim().isEmpty()) {
                baseJpql.append("AND (LOWER(h.nomeCompleto) LIKE LOWER(CONCAT('%', :termo, '%')) ");
                baseJpql.append("OR h.cpf LIKE CONCAT('%', :termo, '%') ");
                baseJpql.append("OR LOWER(h.email) LIKE LOWER(CONCAT('%', :termo, '%'))) ");
            }

            // Query para o total
            TypedQuery<Long> countQuery = entityManager.createQuery("SELECT COUNT(h) " + baseJpql.toString(), Long.class);
            if (hospedeFiltro.getNomeCompleto() != null && !hospedeFiltro.getNomeCompleto().trim().isEmpty()) {
                countQuery.setParameter("termo", hospedeFiltro.getNomeCompleto());
            }
            long totalElements = countQuery.getSingleResult();

            // Query paginada
            String fetchJpql = "SELECT h " + baseJpql.toString() + "ORDER BY h.ativo DESC, h.nomeCompleto ASC";
            TypedQuery<Hospede> query = entityManager.createQuery(fetchJpql, Hospede.class);
            if (hospedeFiltro.getNomeCompleto() != null && !hospedeFiltro.getNomeCompleto().trim().isEmpty()) {
                query.setParameter("termo", hospedeFiltro.getNomeCompleto());
            }
            
            query.setFirstResult(page * size);
            query.setMaxResults(size);
            List<Hospede> resultList = query.getResultList();

            return new PageDTO<>((List<EntidadeDominio>) (List<?>) resultList, totalElements, size, page);
        }
        
        // Fallback genérico caso não seja instância esperada
        long totalElements = entityManager.createQuery("SELECT COUNT(h) FROM Hospede h", Long.class).getSingleResult();
        TypedQuery<Hospede> query = entityManager.createQuery("SELECT h FROM Hospede h ORDER BY h.ativo DESC, h.nomeCompleto ASC", Hospede.class);
        query.setFirstResult(page * size);
        query.setMaxResults(size);
        return new PageDTO<>((List<EntidadeDominio>) (List<?>) query.getResultList(), totalElements, size, page);
    }
}
