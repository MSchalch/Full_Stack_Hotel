package br.com.hotel.domain;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public abstract class EntidadeDominio {
    private Long id;
    private LocalDateTime dataCadastro;
}
