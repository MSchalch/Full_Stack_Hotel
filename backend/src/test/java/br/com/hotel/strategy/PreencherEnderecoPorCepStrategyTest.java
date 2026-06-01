package br.com.hotel.strategy;

import br.com.hotel.domain.Endereco;
import br.com.hotel.domain.Hospede;
import br.com.hotel.domain.dto.ViaCepDTO;
import br.com.hotel.service.ViaCepService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PreencherEnderecoPorCepStrategyTest {

    @Mock
    private ViaCepService viaCepService;

    private PreencherEnderecoPorCepStrategy strategy;
    private Hospede hospede;

    @BeforeEach
    void setUp() {
        strategy = new PreencherEnderecoPorCepStrategy(viaCepService);
        hospede = new Hospede();
    }

    @Test
    void processar_ComCepValidoESemLogradouro_DevePreencherEndereco() {
        Endereco endereco = new Endereco();
        endereco.setCep("01001000");
        hospede.setEndereco(endereco);

        ViaCepDTO mockDto = new ViaCepDTO();
        mockDto.setLogradouro("Praça da Sé");
        mockDto.setBairro("Sé");
        mockDto.setLocalidade("São Paulo");
        mockDto.setUf("SP");

        when(viaCepService.buscarEnderecoPorCep("01001000")).thenReturn(mockDto);

        String resultado = strategy.processar(hospede);

        assertNull(resultado);
        assertEquals("Praça da Sé", hospede.getEndereco().getLogradouro());
        assertEquals("Sé", hospede.getEndereco().getBairro());
        assertEquals("São Paulo", hospede.getEndereco().getCidade());
        assertEquals("SP", hospede.getEndereco().getEstado());
    }

    @Test
    void processar_ComEnderecoJaPreenchido_NaoDeveChamarViaCep() {
        Endereco endereco = new Endereco();
        endereco.setCep("01001000");
        endereco.setLogradouro("Rua Existente"); // Já preenchido
        hospede.setEndereco(endereco);

        String resultado = strategy.processar(hospede);

        assertNull(resultado);
        // Verifica que o serviço nunca foi chamado
        verify(viaCepService, never()).buscarEnderecoPorCep(anyString());
        assertEquals("Rua Existente", hospede.getEndereco().getLogradouro());
    }
}
