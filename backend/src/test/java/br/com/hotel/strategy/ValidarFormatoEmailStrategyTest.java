package br.com.hotel.strategy;

import br.com.hotel.domain.Email;
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
        Email email = new Email();
        email.setDescricao("teste@hotel.com.br");
        hospede.setEmail(email);

        String resultado = strategy.processar(hospede);

        assertNull(resultado, "A strategy deveria retornar null para um e-mail com formato válido.");
    }

    @Test
    void processar_ComEmailInvalido_DeveRetornarErro() {
        Email email = new Email();
        email.setDescricao("teste.com.br"); // Sem @
        hospede.setEmail(email);

        String resultado = strategy.processar(hospede);

        assertEquals("Formato de e-mail inválido.", resultado);
    }

    @Test
    void processar_ComEmailNulo_DeveIgnorarRetornandoNull() {
        // Se for nulo, a validação de obrigatoriedade pegará (em outra strategy), esta só valida formato
        hospede.setEmail(null);

        String resultado = strategy.processar(hospede);

        assertNull(resultado);
    }
}
