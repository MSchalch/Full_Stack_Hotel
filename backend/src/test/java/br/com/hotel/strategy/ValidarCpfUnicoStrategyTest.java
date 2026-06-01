package br.com.hotel.strategy;

import br.com.hotel.domain.Hospede;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ValidarCpfUnicoStrategyTest {

    @Mock
    private EntityManager entityManager;

    @Mock
    private TypedQuery<Long> typedQuery;

    private ValidarCpfUnicoStrategy strategy;
    private Hospede hospede;

    @BeforeEach
    void setUp() {
        strategy = new ValidarCpfUnicoStrategy(entityManager);
        hospede = new Hospede();
        hospede.setCpf("12345678901");
    }

    @Test
    void processar_ComCpfJaExistente_DeveRetornarErro() {
        when(entityManager.createQuery(anyString(), eq(Long.class))).thenReturn(typedQuery);
        when(typedQuery.setParameter(eq("cpf"), anyString())).thenReturn(typedQuery);
        when(typedQuery.getSingleResult()).thenReturn(1L); // CPF existe

        String resultado = strategy.processar(hospede);

        assertEquals("O CPF informado já está cadastrado no sistema.", resultado);
    }

    @Test
    void processar_ComCpfInedito_DeveRetornarNull() {
        when(entityManager.createQuery(anyString(), eq(Long.class))).thenReturn(typedQuery);
        when(typedQuery.setParameter(eq("cpf"), anyString())).thenReturn(typedQuery);
        when(typedQuery.getSingleResult()).thenReturn(0L); // CPF não existe

        String resultado = strategy.processar(hospede);

        assertNull(resultado);
    }
}
