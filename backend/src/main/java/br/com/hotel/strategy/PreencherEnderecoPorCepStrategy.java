package br.com.hotel.strategy;

import br.com.hotel.domain.Endereco;
import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Hospede;
import br.com.hotel.domain.dto.ViaCepDTO;
import br.com.hotel.service.ViaCepService;

public class PreencherEnderecoPorCepStrategy implements IStrategy {

    private ViaCepService viaCepService;

    public PreencherEnderecoPorCepStrategy(ViaCepService viaCepService) {
        this.viaCepService = viaCepService;
    }

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Hospede hospede) {
            Endereco endereco = hospede.getEndereco();
            
            // Se tem o objeto endereço e o CEP está preenchido
            if (endereco != null && endereco.getCep() != null && !endereco.getCep().trim().isEmpty()) {
                
                // Se logradouro ou bairro estiverem vazios, tentamos preencher
                if (endereco.getLogradouro() == null || endereco.getLogradouro().trim().isEmpty()) {
                    
                    ViaCepDTO dto = viaCepService.buscarEnderecoPorCep(endereco.getCep());
                    
                    if (dto != null) {
                        endereco.setLogradouro(dto.getLogradouro());
                        endereco.setBairro(dto.getBairro());
                        
                        if (endereco.getCidade() == null || endereco.getCidade().trim().isEmpty()) {
                            endereco.setCidade(dto.getLocalidade());
                            endereco.setEstado(dto.getUf());
                        }
                    }
                }
            }
        }
        return null;
    }
}
