package br.com.hotel.strategy;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Hospede;
import jakarta.persistence.EntityManager;
import java.util.List;

public class ValidarExclusaoHospedeResponsavelStrategy implements IStrategy {
    private EntityManager entityManager;

    public ValidarExclusaoHospedeResponsavelStrategy(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Hospede hospede && hospede.getId() != null) {
            String jpql = "SELECT CONCAT(h.nomeCompleto, ' - cpf ', h.cpf) FROM Hospede h WHERE h.responsavel.id = :id";
            List<String> dependentes = entityManager.createQuery(jpql, String.class)
                    .setParameter("id", hospede.getId())
                    .getResultList();
            
            if (!dependentes.isEmpty()) {
                Hospede hospedeDB = entityManager.find(Hospede.class, hospede.getId());
                String nome = hospedeDB != null ? hospedeDB.getNomeCompleto() : "Este hóspede";
                return "Não é possível excluir: " + nome + " é responsável por: " + String.join(", ", dependentes) + ".";
            }
        }
        return null;
    }
}
