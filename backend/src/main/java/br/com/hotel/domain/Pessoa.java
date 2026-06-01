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
    private String cpf; // String conforme solicitado, tratado por strategy
    private LocalDate dataNascimento;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "telefone_id")
    private Telefone telefone;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "email_id")
    private Email email;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "endereco_id")
    private Endereco endereco;
}
