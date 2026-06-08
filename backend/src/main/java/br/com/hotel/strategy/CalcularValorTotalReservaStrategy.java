package br.com.hotel.strategy;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Reserva;
import br.com.hotel.domain.Quarto;
import br.com.hotel.domain.Promocao;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.temporal.ChronoUnit;

public class CalcularValorTotalReservaStrategy implements IStrategy {
    private EntityManager entityManager;

    public CalcularValorTotalReservaStrategy(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Reserva reserva && reserva.getCheckIn() != null && reserva.getCheckOut() != null && reserva.getQuarto() != null) {
            long diarias = ChronoUnit.DAYS.between(reserva.getCheckIn().toLocalDate(), reserva.getCheckOut().toLocalDate());
            
            if (diarias < 1) {
                diarias = 1; // Mínimo de 1 diária
            }

            Quarto quarto = entityManager.find(Quarto.class, reserva.getQuarto().getId());
            if (quarto == null) return "Quarto não encontrado para calcular valor.";

            BigDecimal precoBase = quarto.getPrecoBase();
            BigDecimal valorTotal = precoBase.multiply(BigDecimal.valueOf(diarias));

            // Aplicação da Promoção
            if (reserva.getPromocao() != null && reserva.getPromocao().getId() != null) {
                Promocao promocao = entityManager.find(Promocao.class, reserva.getPromocao().getId());
                if (promocao != null && promocao.getAtivo()) {
                    if (promocao.getPorcentagem() != null && promocao.getPorcentagem() > 0) {
                        BigDecimal desconto = valorTotal.multiply(BigDecimal.valueOf(promocao.getPorcentagem() / 100.0));
                        valorTotal = valorTotal.subtract(desconto);
                    } else if (promocao.getValorDesconto() != null && promocao.getValorDesconto().compareTo(BigDecimal.ZERO) > 0) {
                        valorTotal = valorTotal.subtract(promocao.getValorDesconto());
                    }
                }
            }
            
            if (valorTotal.compareTo(BigDecimal.ZERO) < 0) {
                valorTotal = BigDecimal.ZERO;
            }

            reserva.setValorTotal(valorTotal.setScale(2, RoundingMode.HALF_UP));
        }
        return null;
    }
}
