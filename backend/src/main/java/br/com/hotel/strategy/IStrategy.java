package br.com.hotel.strategy;

import br.com.hotel.domain.EntidadeDominio;

public interface IStrategy {
    public String processar(EntidadeDominio entidade);
}
