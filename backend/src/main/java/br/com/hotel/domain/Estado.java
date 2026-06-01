package br.com.hotel.domain;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Estado extends EntidadeDominio {
    private String nome;
    private String uf;
}
