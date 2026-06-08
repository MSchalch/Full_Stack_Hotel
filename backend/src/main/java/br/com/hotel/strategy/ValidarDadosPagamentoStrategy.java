package br.com.hotel.strategy;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Pagamento;
import java.math.BigDecimal;

public class ValidarDadosPagamentoStrategy implements IStrategy {
    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Pagamento pagamento) {
            if (pagamento.getReserva() == null || pagamento.getReserva().getId() == null) {
                return "A Reserva é obrigatória para registrar um pagamento.";
            }
            if (pagamento.getFormaPagamento() == null) {
                return "A Forma de Pagamento é obrigatória.";
            }
            if (pagamento.getValor() == null || pagamento.getValor().compareTo(BigDecimal.ZERO) <= 0) {
                return "O Valor do pagamento deve ser maior que zero.";
            }
        }
        return null;
    }
}
