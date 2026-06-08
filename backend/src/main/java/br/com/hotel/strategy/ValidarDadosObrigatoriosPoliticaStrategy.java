package br.com.hotel.strategy;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.PoliticaCancelamento;

public class ValidarDadosObrigatoriosPoliticaStrategy implements IStrategy {
    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof PoliticaCancelamento politica) {
            if (politica.getNome() == null || politica.getNome().trim().isEmpty()) {
                return "O nome da política de cancelamento é obrigatório.";
            }
            if (politica.getPorcentagem() == null) return "A porcentagem da multa é obrigatória.";
            if (politica.getHorasAntesCancelamento() == null) return "O prazo de horas antecedente é obrigatório.";
            if (politica.getEstornoValor() == null) return "É obrigatório informar se há estorno de valor.";
        }
        return null;
    }
}
