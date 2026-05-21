package br.com.hotel.dao;

import br.com.hotel.domain.EntidadeDominio;
import java.util.List;

public interface IDAO {
    public void salvar(EntidadeDominio entidade);
    public void alterar(EntidadeDominio entidade);
    public void deletar(EntidadeDominio entidade);
    public List<EntidadeDominio> consultar(EntidadeDominio entidade);
}
