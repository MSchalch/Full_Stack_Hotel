package br.com.hotel.dao;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Hospede;
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
                jpql.append("AND LOWER(h.nomeCompleto) LIKE LOWER(CONCAT('%', :nome, '%')) ");
            }
            if (hospedeFiltro.getCpf() != null && !hospedeFiltro.getCpf().trim().isEmpty()) {
                jpql.append("AND h.cpf = :cpf ");
            }

            TypedQuery<Hospede> query = entityManager.createQuery(jpql.toString(), Hospede.class);

            if (hospedeFiltro.getNomeCompleto() != null && !hospedeFiltro.getNomeCompleto().trim().isEmpty()) {
                query.setParameter("nome", hospedeFiltro.getNomeCompleto());
            }
            if (hospedeFiltro.getCpf() != null && !hospedeFiltro.getCpf().trim().isEmpty()) {
                query.setParameter("cpf", hospedeFiltro.getCpf());
            }

            return (List<EntidadeDominio>) (List<?>) query.getResultList();
        }
        
        // Se vier nulo ou não for Hospede, retorna todos
        return (List<EntidadeDominio>) (List<?>) entityManager.createQuery("SELECT h FROM Hospede h", Hospede.class).getResultList();
    }
}
