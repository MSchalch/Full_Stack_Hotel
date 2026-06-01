package br.com.hotel.domain;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class UsuarioFuncionario extends Pessoa {
    private Boolean ativo = true;
}
