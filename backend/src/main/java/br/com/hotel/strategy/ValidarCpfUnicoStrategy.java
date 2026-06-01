package br.com.hotel.strategy;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Pessoa;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Component;

public class ValidarCpfUnicoStrategy implements IStrategy {

    private EntityManager entityManager;

    public ValidarCpfUnicoStrategy(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Pessoa pessoa) {
            String cpf = pessoa.getCpf();
            if (cpf == null || cpf.trim().isEmpty()) {
                return null; // A validação de preenchimento é feita em outra strategy
            }

            String jpql = "SELECT COUNT(p) FROM Pessoa p WHERE p.cpf = :cpf";
            if (pessoa.getId() != null) {
                jpql += " AND p.id <> :id";
            }

            TypedQuery<Long> query = entityManager.createQuery(jpql, Long.class);
            query.setParameter("cpf", cpf);
            if (pessoa.getId() != null) {
                query.setParameter("id", pessoa.getId());
            }

            Long count = query.getSingleResult();
            if (count > 0) {
                return "O CPF informado já está cadastrado no sistema.";
            }
        }
        return null;
    }
}
