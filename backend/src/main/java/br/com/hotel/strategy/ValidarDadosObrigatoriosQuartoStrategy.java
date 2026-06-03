package br.com.hotel.strategy;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Quarto;

public class ValidarDadosObrigatoriosQuartoStrategy implements IStrategy {
    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Quarto quarto) {
            if (quarto.getNumero() == null) return "Número do quarto é obrigatório.";
            if (quarto.getPrecoBase() == null) return "Preço base é obrigatório.";
            if (quarto.getTipoQuarto() == null) return "Tipo do quarto é obrigatório.";
            if (quarto.getCapAdultos() == null) return "Capacidade de adultos é obrigatória.";
            if (quarto.getCapCriancas() == null) return "Capacidade de crianças é obrigatória.";
        }
        return null;
    }
}
