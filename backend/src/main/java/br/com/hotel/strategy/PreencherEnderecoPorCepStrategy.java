package br.com.hotel.strategy;

import br.com.hotel.domain.Cidade;
import br.com.hotel.domain.Endereco;
import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Estado;
import br.com.hotel.domain.Hospede;
import br.com.hotel.domain.dto.ViaCepDTO;
import br.com.hotel.service.ViaCepService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

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
                        
                        // Atualiza a cidade e estado se necessário (opcional, dependendo de como as tabelas são tratadas)
                        if (endereco.getCidade() == null) {
                            Cidade cidade = new Cidade();
                            cidade.setNome(dto.getLocalidade());
                            
                            Estado estado = new Estado();
                            estado.setUf(dto.getUf());
                            estado.setNome(dto.getUf()); // simplificação para pegar a UF como nome
                            
                            cidade.setEstado(estado);
                            endereco.setCidade(cidade);
                        }
                    }
                }
            }
        }
        return null; // Sempre retorna null pois essa strategy não barra o fluxo, apenas tenta preencher.
    }
}
