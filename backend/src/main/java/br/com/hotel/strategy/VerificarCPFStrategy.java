package br.com.hotel.strategy;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Pessoa;
import org.springframework.stereotype.Component;

public class VerificarCPFStrategy implements IStrategy {

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Pessoa pessoa) {
            String cpf = pessoa.getCpf();
            if (cpf == null || cpf.trim().isEmpty()) {
                return "CPF é obrigatório.";
            }

            cpf = cpf.replaceAll("[^0-9]", "");
            pessoa.setCpf(cpf);
            
            if (cpf.length() != 11) {
                return "CPF deve conter 11 dígitos.";
            }

            // Impede CPFs formados por uma sequência de números iguais
            if (cpf.matches("(\\d)\\1{10}")) {
                return "CPF inválido.";
            }

            // Calcula os dígitos verificadores
            try {
                int sm = 0, peso = 10, r, num;
                for (int i = 0; i < 9; i++) {
                    num = (int) (cpf.charAt(i) - 48);
                    sm = sm + (num * peso);
                    peso--;
                }
                r = 11 - (sm % 11);
                char dig10 = (r == 10 || r == 11) ? '0' : (char) (r + 48);

                sm = 0;
                peso = 11;
                for (int i = 0; i < 10; i++) {
                    num = (int) (cpf.charAt(i) - 48);
                    sm = sm + (num * peso);
                    peso--;
                }
                r = 11 - (sm % 11);
                char dig11 = (r == 10 || r == 11) ? '0' : (char) (r + 48);

                if ((dig10 != cpf.charAt(9)) || (dig11 != cpf.charAt(10))) {
                    return "CPF inválido (dígito verificador incorreto).";
                }
            } catch (Exception e) {
                return "Erro ao validar CPF.";
            }
        }
        return null;
    }
}
