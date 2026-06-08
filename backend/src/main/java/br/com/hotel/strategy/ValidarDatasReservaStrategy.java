package br.com.hotel.strategy;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Reserva;
import java.time.LocalDateTime;

public class ValidarDatasReservaStrategy implements IStrategy {
    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Reserva reserva) {
            LocalDateTime checkIn = reserva.getCheckIn();
            LocalDateTime checkOut = reserva.getCheckOut();
            
            if (checkIn != null && checkOut != null) {
                if (!checkOut.isAfter(checkIn)) {
                    return "A data de saída (Check-out) deve ser posterior à data de entrada (Check-in).";
                }
            }
        }
        return null;
    }
}
