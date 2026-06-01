package br.com.hotel.domain;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Embeddable
public class Endereco {
    private String logradouro;
    private String numero;
    private String cep;
    private String bairro;
    private String complemento;
    private String cidade;
    private String estado;
}
