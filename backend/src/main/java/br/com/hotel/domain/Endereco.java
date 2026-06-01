package br.com.hotel.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Endereco extends EntidadeDominio {
    private String logradouro;
    private String numero;
    private String cep;
    private String bairro;
    private String complemento;
    
    @ManyToOne
    @JoinColumn(name = "cidade_id")
    private Cidade cidade;
}
