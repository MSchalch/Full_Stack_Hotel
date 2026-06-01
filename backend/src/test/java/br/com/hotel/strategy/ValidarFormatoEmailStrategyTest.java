package br.com.hotel.strategy;

import br.com.hotel.domain.Hospede;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class ValidarFormatoEmailStrategyTest {

    private ValidarFormatoEmailStrategy strategy;
    private Hospede hospede;

    @BeforeEach
    void setUp() {
        strategy = new ValidarFormatoEmailStrategy();
        hospede = new Hospede();
    }

    @Test
    void processar_ComEmailValido_DeveRetornarNull() {
        hospede.setEmail("teste@hotel.com.br");

        String resultado = strategy.processar(hospede);

        assertNull(resultado, "A strategy deveria retornar null para um e-mail com formato válido.");
    }

    @Test
    void processar_ComEmailInvalido_DeveRetornarErro() {
        hospede.setEmail("teste.com.br"); // Sem @

        String resultado = strategy.processar(hospede);

        assertEquals("Formato de e-mail inválido.", resultado);
    }

    @Test
    void processar_ComEmailNulo_DeveIgnorarRetornandoNull() {
        hospede.setEmail(null);

        String resultado = strategy.processar(hospede);

        assertNull(resultado);
    }
}
