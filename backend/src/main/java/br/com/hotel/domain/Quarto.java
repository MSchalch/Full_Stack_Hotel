package br.com.hotel.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
public class Quarto extends EntidadeDominio {
    private Boolean ativo = true;
    private Integer capAdultos;
    private Integer capCriancas;
    private Integer numero;
    private BigDecimal precoBase;

    @Enumerated(EnumType.STRING)
    private TipoQuarto tipoQuarto;
}
