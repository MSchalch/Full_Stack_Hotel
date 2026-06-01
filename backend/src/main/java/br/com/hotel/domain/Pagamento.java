package br.com.hotel.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class Pagamento extends EntidadeDominio {
    private BigDecimal valor;
    private LocalDateTime dataOperacao;

    @ManyToOne
    @JoinColumn(name = "reserva_id")
    private Reserva reserva;

    @Enumerated(EnumType.STRING)
    private FormaPagamento formaPagamento;

    @Enumerated(EnumType.STRING)
    private StatusPagamento statusPagamento;
}
