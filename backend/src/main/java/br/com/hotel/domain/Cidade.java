package br.com.hotel.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Cidade extends EntidadeDominio {
    private String nome;
    
    @ManyToOne
    @JoinColumn(name = "estado_id")
    private Estado estado;
}
