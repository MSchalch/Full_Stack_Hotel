package br.com.hotel.strategy;

import br.com.hotel.domain.Hospede;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class VerificarCPFStrategyTest {

    private VerificarCPFStrategy strategy;
    private Hospede hospede;

    @BeforeEach
    void setUp() {
        strategy = new VerificarCPFStrategy();
        hospede = new Hospede();
    }

    @Test
    void processar_ComCpfValido_DeveRetornarNull() {
        // CPF válido gerado aleatoriamente para teste matemático
        hospede.setCpf("52998224725"); 
        
        String resultado = strategy.processar(hospede);
        
        assertNull(resultado, "A strategy deveria retornar null para um CPF válido.");
    }

    @Test
    void processar_ComCpfInvalido_DeveRetornarMensagemErro() {
        hospede.setCpf("52998224720"); 
        String resultado = strategy.processar(hospede);
        assertEquals("CPF inválido (dígito verificador incorreto).", resultado);
    }

    @Test
    void processar_ComCpfFormatado_DeveRemoverMascaraEValidar() {
        // O mesmo CPF válido, mas com pontuação
        hospede.setCpf("529.982.247-25"); 
        
        String resultado = strategy.processar(hospede);
        
        assertNull(resultado);
        // Garante que a strategy limpou a formatação antes de salvar
        assertEquals("52998224725", hospede.getCpf());
    }

    @Test
    void processar_ComCpfNuloOuVazio_DeveRetornarErro() {
        hospede.setCpf(null);
        assertEquals("CPF é obrigatório.", strategy.processar(hospede));

        hospede.setCpf("");
        assertEquals("CPF é obrigatório.", strategy.processar(hospede));
    }
}
