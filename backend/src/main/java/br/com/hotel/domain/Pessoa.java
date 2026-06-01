package br.com.hotel.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class Pessoa extends EntidadeDominio {
    private String nomeCompleto;
    private String cpf; 
    private LocalDate dataNascimento;
    
    private String telefone;
    private String email;

    @Embedded
    private Endereco endereco;
}
