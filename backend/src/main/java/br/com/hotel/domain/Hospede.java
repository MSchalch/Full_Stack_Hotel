package br.com.hotel.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Hospede extends Pessoa {
    // Campos específicos de Hóspede
    private Boolean ativo = true; // Por padrão ativo, cobrindo o RF0103

    @ManyToOne
    @JoinColumn(name = "responsavel_id")
    private Hospede responsavel;
}
