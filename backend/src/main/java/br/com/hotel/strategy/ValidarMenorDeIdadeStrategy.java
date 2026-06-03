package br.com.hotel.strategy;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Hospede;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.time.Period;

public class ValidarMenorDeIdadeStrategy implements IStrategy {
    private EntityManager entityManager;

    public ValidarMenorDeIdadeStrategy(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Hospede hospede) {
            if (hospede.getDataNascimento() != null) {
                int idade = Period.between(hospede.getDataNascimento(), LocalDate.now()).getYears();
                if (idade < 18) {
                    if (hospede.getResponsavel() == null || hospede.getResponsavel().getId() == null) {
                        return "Hóspede menor de idade (" + idade + " anos) deve possuir um responsável.";
                    } else {
                        Hospede responsavelDB = entityManager.find(Hospede.class, hospede.getResponsavel().getId());
                        if (responsavelDB == null) {
                            return "Responsável informado não foi encontrado.";
                        }
                        if (responsavelDB.getDataNascimento() != null) {
                            int idadeResp = Period.between(responsavelDB.getDataNascimento(), LocalDate.now()).getYears();
                            if (idadeResp < 18) {
                                return "O responsável informado (" + responsavelDB.getNomeCompleto() + ") também é menor de idade.";
                            }
                        }
                    }
                }
            }
        }
        return null;
    }
}
