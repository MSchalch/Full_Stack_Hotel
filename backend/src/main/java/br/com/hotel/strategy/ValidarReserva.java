package br.com.hotel.strategy;

import br.com.hotel.domain.EntidadeDominio;

public class ValidarReserva implements IStrategy {
    @Override
    public String processar(EntidadeDominio entidade) {
        // Implementação futura: validar datas, campos obrigatórios, etc.
        return null; 
    }
}
