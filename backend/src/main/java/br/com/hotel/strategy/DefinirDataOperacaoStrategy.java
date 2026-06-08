package br.com.hotel.strategy;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Pagamento;
import java.time.LocalDateTime;

public class DefinirDataOperacaoStrategy implements IStrategy {
    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Pagamento pagamento) {
            if (pagamento.getId() == null && pagamento.getDataOperacao() == null) {
                pagamento.setDataOperacao(LocalDateTime.now());
            }
        }
        return null;
    }
}
