package br.com.hotel.domain;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
public class Promocao extends EntidadeDominio {
    private Boolean ativo = true;
    private Float porcentagem;
    private BigDecimal valorDesconto;
}
