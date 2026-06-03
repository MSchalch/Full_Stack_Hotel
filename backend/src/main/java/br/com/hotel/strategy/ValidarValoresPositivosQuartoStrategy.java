package br.com.hotel.strategy;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Quarto;
import java.math.BigDecimal;

public class ValidarValoresPositivosQuartoStrategy implements IStrategy {
    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Quarto quarto) {
            if (quarto.getNumero() != null && quarto.getNumero() <= 0) 
                return "Número do quarto deve ser maior que zero.";
            if (quarto.getPrecoBase() != null && quarto.getPrecoBase().compareTo(BigDecimal.ZERO) < 0) 
                return "Preço base não pode ser negativo.";
            if (quarto.getCapAdultos() != null && quarto.getCapAdultos() <= 0) 
                return "Capacidade de adultos deve ser no mínimo 1.";
            if (quarto.getCapCriancas() != null && quarto.getCapCriancas() < 0) 
                return "Capacidade de crianças não pode ser negativa.";
        }
        return null;
    }
}
