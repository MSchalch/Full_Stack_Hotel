package br.com.hotel.strategy;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Promocao;
import java.math.BigDecimal;

public class ValidarRegrasPromocaoStrategy implements IStrategy {
    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Promocao promocao) {
            if (promocao.getNome() == null || promocao.getNome().trim().isEmpty()) {
                return "O nome da promoção é obrigatório.";
            }

            boolean temPorcentagem = promocao.getPorcentagem() != null;
            boolean temValorDesconto = promocao.getValorDesconto() != null;

            if (!temPorcentagem && !temValorDesconto) {
                return "Você deve preencher a Porcentagem ou o Valor Fixo de desconto.";
            }

            if (temPorcentagem && temValorDesconto) {
                return "Uma promoção não pode ter Porcentagem e Valor Fixo ao mesmo tempo.";
            }

            if (temPorcentagem) {
                if (promocao.getPorcentagem() <= 0 || promocao.getPorcentagem() > 100) {
                    return "A porcentagem de desconto deve ser entre 1 e 100.";
                }
            }

            if (temValorDesconto) {
                if (promocao.getValorDesconto().compareTo(BigDecimal.ZERO) <= 0) {
                    return "O valor de desconto deve ser maior que zero.";
                }
            }
        }
        return null;
    }
}
