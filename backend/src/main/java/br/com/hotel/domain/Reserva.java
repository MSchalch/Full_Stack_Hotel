package br.com.hotel.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class Reserva extends EntidadeDominio {
    private Boolean noShow = false;
    private LocalDateTime checkIn;
    private LocalDateTime checkOut;
    private Integer quantAdultos;
    private Integer quantCriancas;
    private BigDecimal valorTotal;

    @ManyToOne
    @JoinColumn(name = "quarto_id")
    private Quarto quarto;

    @ManyToOne
    @JoinColumn(name = "hospede_id")
    private Hospede hospede;

    @Enumerated(EnumType.STRING)
    private StatusReserva status;

    @Enumerated(EnumType.STRING)
    private CanalOrigem canal;

    @ManyToOne
    @JoinColumn(name = "politica_cancelamento_id")
    private PoliticaCancelamento politicaCancelamento;

    @ManyToOne
    @JoinColumn(name = "promocao_id")
    private Promocao promocao;
}
