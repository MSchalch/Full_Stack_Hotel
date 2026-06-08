package br.com.hotel.strategy;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.PoliticaCancelamento;

public class ValidarValoresPoliticaStrategy implements IStrategy {
    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof PoliticaCancelamento pol) {
            if (pol.getPorcentagem() != null) {
                if (pol.getPorcentagem() < 0 || pol.getPorcentagem() > 100) {
                    return "A porcentagem da multa deve ser entre 0 e 100.";
                }
            }
            if (pol.getHorasAntesCancelamento() != null) {
                if (pol.getHorasAntesCancelamento() <= 0) {
                    return "As horas de antecedência limite devem ser maiores que zero.";
                }
            }
        }
        return null;
    }
}
