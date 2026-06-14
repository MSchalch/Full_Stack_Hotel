package br.com.hotel.dao;

import br.com.hotel.domain.EntidadeDominio;
import br.com.hotel.dto.PageDTO;
import java.util.List;

public interface IDAO {
    public void salvar(EntidadeDominio entidade);
    public void alterar(EntidadeDominio entidade);
    public void deletar(EntidadeDominio entidade);
    public List<EntidadeDominio> consultar(EntidadeDominio entidade);
    public PageDTO<EntidadeDominio> consultarPaginado(EntidadeDominio entidade, int page, int size);
}
