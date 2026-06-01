package br.com.hotel.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Notificacao extends EntidadeDominio {
    private String texto;

    @Enumerated(EnumType.STRING)
    private TipoNotificacao tipoNotificacao;

    @ManyToOne
    @JoinColumn(name = "reserva_id")
    private Reserva reserva;
}
