package br.com.hotel.strategy;

import br.com.hotel.domain.EntidadeDominio;

public class ValidarPagamento implements IStrategy {
    @Override
    public String processar(EntidadeDominio entidade) {
        // Implementação futura: validar se valor bate com reserva, etc.
        return null;
    }
}
