package br.com.hotel.domain;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class PoliticaCancelamento extends EntidadeDominio {
    private Boolean ativo = true;
    private Float porcentagem;
    private Boolean estornoValor;
    private Integer horasAntesCancelamento;
}
