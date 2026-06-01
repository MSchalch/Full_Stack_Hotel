package br.com.hotel.strategy;

import br.com.hotel.domain.Cidade;
import br.com.hotel.domain.Endereco;
import br.com.hotel.domain.Estado;
import br.com.hotel.domain.Email;
import br.com.hotel.domain.Hospede;
import br.com.hotel.domain.Telefone;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class ValidarDadosObrigatoriosHospedeStrategyTest {

    private ValidarDadosObrigatoriosHospedeStrategy strategy;
    private Hospede hospede;

    @BeforeEach
    void setUp() {
        strategy = new ValidarDadosObrigatoriosHospedeStrategy();
        hospede = new Hospede();
    }

    @Test
    void processar_ComTodosDadosPreenchidos_DeveRetornarNull() {
        hospede.setNomeCompleto("João da Silva");
        hospede.setCpf("12345678901");
        hospede.setDataNascimento(LocalDate.of(1990, 1, 1));
        
        Telefone tel = new Telefone();
        tel.setDescricao("11999999999");
        hospede.setTelefone(tel);

        Email email = new Email();
        email.setDescricao("joao@email.com");
        hospede.setEmail(email);
        
        Endereco end = new Endereco();
        end.setLogradouro("Rua A");
        end.setNumero("123");
        end.setCep("01001000");
        end.setBairro("Centro");
        Cidade cidade = new Cidade();
        Estado estado = new Estado();
        cidade.setEstado(estado);
        end.setCidade(cidade);
        hospede.setEndereco(end);

        String resultado = strategy.processar(hospede);

        assertNull(resultado);
    }

    @Test
    void processar_SemNome_DeveRetornarErro() {
        hospede.setNomeCompleto(null);
        assertEquals("Nome completo do hóspede é obrigatório.", strategy.processar(hospede));

        hospede.setNomeCompleto("   ");
        assertEquals("Nome completo do hóspede é obrigatório.", strategy.processar(hospede));
    }

    @Test
    void processar_SemTelefone_DeveRetornarErro() {
        hospede.setNomeCompleto("João");
        hospede.setCpf("12345678901");
        hospede.setDataNascimento(LocalDate.of(1990, 1, 1));
        
        // Sem setar telefone
        assertEquals("Telefone é obrigatório.", strategy.processar(hospede));
    }
}
