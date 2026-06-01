package br.com.hotel.strategy;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Reserva;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.temporal.ChronoUnit;

public class CalcularValorTotalReservaStrategy implements IStrategy {

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Reserva reserva) {
            
            // Verifica se possui quarto, precoBase, checkin e checkout
            if (reserva.getQuarto() == null || reserva.getQuarto().getPrecoBase() == null || 
                reserva.getCheckIn() == null || reserva.getCheckOut() == null) {
                return null; // Caso não tenha dados para cálculo, a validação de dados obrigatórios barrará
            }

            long dias = ChronoUnit.DAYS.between(reserva.getCheckIn().toLocalDate(), reserva.getCheckOut().toLocalDate());
            if (dias <= 0) {
                dias = 1; // Mínimo de 1 diária
            }

            BigDecimal valorTotal = reserva.getQuarto().getPrecoBase().multiply(new BigDecimal(dias));

            if (reserva.getPromocao() != null) {
                if (reserva.getPromocao().getPorcentagem() != null && reserva.getPromocao().getPorcentagem() > 0) {
                    BigDecimal percentual = BigDecimal.valueOf(reserva.getPromocao().getPorcentagem()).divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
                    BigDecimal desconto = valorTotal.multiply(percentual);
                    valorTotal = valorTotal.subtract(desconto);
                }
                
                if (reserva.getPromocao().getValorDesconto() != null && reserva.getPromocao().getValorDesconto().compareTo(BigDecimal.ZERO) > 0) {
                    valorTotal = valorTotal.subtract(reserva.getPromocao().getValorDesconto());
                }
            }

            // Impede valor total negativo se o desconto for maior que o total
            if (valorTotal.compareTo(BigDecimal.ZERO) < 0) {
                valorTotal = BigDecimal.ZERO;
            }

            reserva.setValorTotal(valorTotal.setScale(2, RoundingMode.HALF_UP));
        }
        return null;
    }
}
