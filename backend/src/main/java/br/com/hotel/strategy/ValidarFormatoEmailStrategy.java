package br.com.hotel.strategy;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.domain.Pessoa;
import java.util.regex.Pattern;

public class ValidarFormatoEmailStrategy implements IStrategy {
    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@(.+)$";
    private static final Pattern PATTERN = Pattern.compile(EMAIL_REGEX);

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Pessoa pessoa) {
            String email = pessoa.getEmail();
            if (email != null && !email.trim().isEmpty()) {
                if (!PATTERN.matcher(email).matches()) {
                    return "Formato de e-mail inválido.";
                }
            }
        }
        return null;
    }
}
