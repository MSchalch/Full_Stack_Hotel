package br.com.hotel.facade;

import br.com.hotel.domain.EntidadeDominio;
import java.util.List;

public interface IFacade {
    public String salvar(EntidadeDominio entidade);
    public String alterar(EntidadeDominio entidade);
    public String deletar(EntidadeDominio entidade);
    public List<EntidadeDominio> consultar(EntidadeDominio entidade);
}
