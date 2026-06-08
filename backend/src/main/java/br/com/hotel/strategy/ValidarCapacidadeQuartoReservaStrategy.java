package br.com.hotel.strategy;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Reserva;
import br.com.hotel.domain.Quarto;
import br.com.hotel.domain.Hospede;
import jakarta.persistence.EntityManager;

import java.time.LocalDate;
import java.time.Period;

public class ValidarCapacidadeQuartoReservaStrategy implements IStrategy {
    private EntityManager entityManager;

    public ValidarCapacidadeQuartoReservaStrategy(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Reserva reserva && reserva.getQuarto() != null) {
            Quarto quarto = entityManager.find(Quarto.class, reserva.getQuarto().getId());
            if (quarto == null) return "Quarto não encontrado.";

            int adultosNaReserva = 0;
            int criancasNaReserva = 0;

            // Contar Titular
            if (reserva.getHospede() != null && reserva.getHospede().getId() != null) {
                Hospede titular = entityManager.find(Hospede.class, reserva.getHospede().getId());
                if (titular != null) {
                    if (isCrianca(titular.getDataNascimento())) {
                        criancasNaReserva++;
                    } else {
                        adultosNaReserva++;
                    }
                }
            }

            // Contar Acompanhantes
            if (reserva.getAcompanhantes() != null) {
                for (Hospede a : reserva.getAcompanhantes()) {
                    if (a.getId() != null) {
                        Hospede acompanhante = entityManager.find(Hospede.class, a.getId());
                        if (acompanhante != null) {
                            if (isCrianca(acompanhante.getDataNascimento())) {
                                criancasNaReserva++;
                            } else {
                                adultosNaReserva++;
                            }
                        }
                    }
                }
            }

            // Sobrescrever os valores vindos do frontend pela recontagem real
            reserva.setQuantAdultos(adultosNaReserva);
            reserva.setQuantCriancas(criancasNaReserva);

            if (adultosNaReserva > quarto.getCapAdultos() || criancasNaReserva > quarto.getCapCriancas()) {
                return "A capacidade da reserva excede a capacidade do quarto escolhido (Max Adultos: " 
                    + quarto.getCapAdultos() + ", Max Crianças: " + quarto.getCapCriancas() + "). \nTotal na reserva: " + adultosNaReserva + " adulto(s) e " + criancasNaReserva + " criança(s) de até 10 anos.";
            }
        }
        return null;
    }

    private boolean isCrianca(LocalDate dataNascimento) {
        if (dataNascimento == null) return false;
        int idade = Period.between(dataNascimento, LocalDate.now()).getYears();
        return idade <= 10;
    }
}
