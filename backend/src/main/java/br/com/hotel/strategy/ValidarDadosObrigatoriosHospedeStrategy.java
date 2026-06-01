package br.com.hotel.strategy;

import br.com.hotel.domain.Endereco;
import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Hospede;

public class ValidarDadosObrigatoriosHospedeStrategy implements IStrategy {

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Hospede hospede) {
            if (hospede.getNomeCompleto() == null || hospede.getNomeCompleto().trim().isEmpty()) {
                return "Nome completo do hóspede é obrigatório.";
            }
            if (hospede.getDataNascimento() == null) {
                return "Data de nascimento é obrigatória.";
            }
            if (hospede.getTelefone() == null || hospede.getTelefone().trim().isEmpty()) {
                return "Telefone é obrigatório.";
            }
            if (hospede.getEmail() == null || hospede.getEmail().trim().isEmpty()) {
                return "E-mail é obrigatório.";
            }
            
            Endereco end = hospede.getEndereco();
            if (end == null) {
                return "Endereço é obrigatório.";
            }
            if (end.getLogradouro() == null || end.getLogradouro().trim().isEmpty() ||
                end.getNumero() == null || end.getNumero().trim().isEmpty() ||
                end.getCep() == null || end.getCep().trim().isEmpty() ||
                end.getBairro() == null || end.getBairro().trim().isEmpty() ||
                end.getCidade() == null || end.getCidade().trim().isEmpty() ||
                end.getEstado() == null || end.getEstado().trim().isEmpty()) {
                return "Dados incompletos no endereço. Logradouro, número, CEP, bairro, cidade e estado são obrigatórios.";
            }
        }
        return null;
    }
}
