package br.com.hotel.strategy;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Quarto;
import br.com.hotel.domain.TipoQuarto;

public class ValidarCapacidadeQuartosPadraoStrategy implements IStrategy {
    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Quarto quarto) {
            if (quarto.getTipoQuarto() == TipoQuarto.SINGLE || 
                quarto.getTipoQuarto() == TipoQuarto.DUPLO || 
                quarto.getTipoQuarto() == TipoQuarto.SUITE) {
                
                if (quarto.getCapAdultos() != null && quarto.getCapAdultos() > 2) {
                    return "Para quartos padrão (Single, Duplo, Suíte), o limite máximo é de 2 adultos.";
                }
                if (quarto.getCapCriancas() != null && quarto.getCapCriancas() > 2) {
                    return "Para quartos padrão (Single, Duplo, Suíte), o limite máximo é de 2 crianças.";
                }
            }
        }
        return null;
    }
}
