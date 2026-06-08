package br.com.hotel.strategy;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Reserva;

public class ValidarDadosObrigatoriosReservaStrategy implements IStrategy {
    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Reserva reserva) {
            if (reserva.getHospede() == null || reserva.getHospede().getId() == null) {
                return "O hóspede titular da reserva é obrigatório.";
            }
            if (reserva.getQuarto() == null || reserva.getQuarto().getId() == null) {
                return "O quarto da reserva é obrigatório.";
            }
            if (reserva.getCheckIn() == null) return "A data de check-in é obrigatória.";
            if (reserva.getCheckOut() == null) return "A data de check-out é obrigatória.";
            if (reserva.getQuantAdultos() == null || reserva.getQuantAdultos() < 1) {
                return "É obrigatório ter ao menos 1 adulto na reserva.";
            }
            if (reserva.getQuantCriancas() == null) {
                reserva.setQuantCriancas(0);
            }
            if (reserva.getPoliticaCancelamento() == null || reserva.getPoliticaCancelamento().getId() == null) {
                return "A política de cancelamento é obrigatória.";
            }
        }
        return null;
    }
}
