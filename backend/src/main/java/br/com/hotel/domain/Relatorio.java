package br.com.hotel.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Relatorio extends EntidadeDominio {
    private String descricao;

    @Enumerated(EnumType.STRING)
    private TipoRelatorio tipoRelatorio;
}
