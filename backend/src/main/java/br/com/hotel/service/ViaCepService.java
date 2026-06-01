package br.com.hotel.service;

import br.com.hotel.domain.dto.ViaCepDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ViaCepService {

    public ViaCepDTO buscarEnderecoPorCep(String cep) {
        try {
            // Remove qualquer caractere que não seja número
            String cepLimpo = cep.replaceAll("[^0-9]", "");
            if (cepLimpo.length() != 8) {
                return null;
            }
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://viacep.com.br/ws/" + cepLimpo + "/json/";
            ViaCepDTO response = restTemplate.getForObject(url, ViaCepDTO.class);
            
            // A API do ViaCEP retorna um JSON com erro=true se o CEP não existir
            if (response != null && response.getCep() == null) {
                return null;
            }
            return response;
        } catch (Exception e) {
            return null;
        }
    }
}
