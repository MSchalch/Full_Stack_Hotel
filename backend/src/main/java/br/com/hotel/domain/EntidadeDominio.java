package br.com.hotel.domain;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@MappedSuperclass
public abstract class EntidadeDominio {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "entidade_dominio_seq")
    @jakarta.persistence.SequenceGenerator(name = "entidade_dominio_seq", sequenceName = "entidade_dominio_seq", allocationSize = 50)
    private Long id;
    private LocalDateTime dataCadastro;

    @PrePersist
    public void prePersist() {
        if (this.dataCadastro == null) {
            this.dataCadastro = LocalDateTime.now();
        }
    }
}
