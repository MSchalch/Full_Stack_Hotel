package br.com.hotel.facade;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.dto.PageDTO;
import java.util.List;

public interface IFacade {
    public String salvar(EntidadeDominio entidade);
    public String alterar(EntidadeDominio entidade);
    public String deletar(EntidadeDominio entidade);
    public List<EntidadeDominio> consultar(EntidadeDominio entidade);
    public PageDTO<EntidadeDominio> consultarPaginado(EntidadeDominio entidade, int page, int size);
}
