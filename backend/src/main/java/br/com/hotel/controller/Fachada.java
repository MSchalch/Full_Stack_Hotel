package br.com.hotel.controller;

import br.com.hotel.dao.*;
import br.com.hotel.domain.*;
import br.com.hotel.facade.IFacade;
import br.com.hotel.service.ViaCepService;
import br.com.hotel.strategy.*;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class Fachada implements IFacade {

    private Map<String, IDAO> daos;
    private Map<String, Map<String, List<IStrategy>>> rns;

    public Fachada(HospedeDAO hospedeDAO,
                   QuartoDAO quartoDAO,
                   ReservaDAO reservaDAO,
                   PagamentoDAO pagamentoDAO,
                   PoliticaCancelamentoDAO politicaDAO,
                   PromocaoDAO promocaoDAO,
                   ViaCepService viaCepService,
                   EntityManager entityManager) {
        
        daos = new HashMap<>();
        rns = new HashMap<>();

        // 1. Instanciando DAOs
        daos.put(Hospede.class.getName(), hospedeDAO);
        daos.put(Quarto.class.getName(), quartoDAO);
        daos.put(Reserva.class.getName(), reservaDAO);
        daos.put(Pagamento.class.getName(), pagamentoDAO);
        daos.put(PoliticaCancelamento.class.getName(), politicaDAO);
        daos.put(Promocao.class.getName(), promocaoDAO);

        // 2. Instanciando Strategies de Hóspede
        List<IStrategy> rnsSalvarHospede = new ArrayList<>();
        rnsSalvarHospede.add(new PreencherEnderecoPorCepStrategy(viaCepService));
        rnsSalvarHospede.add(new ValidarDadosObrigatoriosHospedeStrategy());
        rnsSalvarHospede.add(new ValidarFormatoEmailStrategy());
        rnsSalvarHospede.add(new VerificarCPFStrategy());
        rnsSalvarHospede.add(new ValidarCpfUnicoStrategy(entityManager));

        List<IStrategy> rnsAlterarHospede = new ArrayList<>();
        rnsAlterarHospede.add(new PreencherEnderecoPorCepStrategy(viaCepService));
        rnsAlterarHospede.add(new ValidarDadosObrigatoriosHospedeStrategy());
        rnsAlterarHospede.add(new ValidarFormatoEmailStrategy());
        rnsAlterarHospede.add(new VerificarCPFStrategy());

        Map<String, List<IStrategy>> rnsHospede = new HashMap<>();
        rnsHospede.put("SALVAR", rnsSalvarHospede);
        rnsHospede.put("ALTERAR", rnsAlterarHospede);
        rnsHospede.put("EXCLUIR", new ArrayList<>()); // vazio por enquanto
        rnsHospede.put("CONSULTAR", new ArrayList<>()); // vazio por enquanto

        rns.put(Hospede.class.getName(), rnsHospede);
        
        // 4. Instanciando Strategies de Reserva
        List<IStrategy> rnsSalvarReserva = new ArrayList<>();
        rnsSalvarReserva.add(new ValidarReserva());
        rnsSalvarReserva.add(new CalcularValorTotalReservaStrategy());

        List<IStrategy> rnsAlterarReserva = new ArrayList<>();
        rnsAlterarReserva.add(new ValidarReserva());
        rnsAlterarReserva.add(new CalcularValorTotalReservaStrategy());

        Map<String, List<IStrategy>> rnsReserva = new HashMap<>();
        rnsReserva.put("SALVAR", rnsSalvarReserva);
        rnsReserva.put("ALTERAR", rnsAlterarReserva);
        rns.put(Reserva.class.getName(), rnsReserva);
        
        // Regras para Pagamento
        List<IStrategy> rnsSalvarPagamento = new ArrayList<>();
        rnsSalvarPagamento.add(new ValidarPagamento());
        
        Map<String, List<IStrategy>> rnsPagamento = new HashMap<>();
        rnsPagamento.put("SALVAR", rnsSalvarPagamento);
        rns.put(Pagamento.class.getName(), rnsPagamento);
    }

    @Override
    public String salvar(EntidadeDominio entidade) {
        return executarRegras(entidade, "SALVAR");
    }

    @Override
    public String alterar(EntidadeDominio entidade) {
        return executarRegras(entidade, "ALTERAR");
    }

    @Override
    public String deletar(EntidadeDominio entidade) {
        return executarRegras(entidade, "EXCLUIR");
    }

    @Override
    public List<EntidadeDominio> consultar(EntidadeDominio entidade) {
        // Implementação básica: se tiver estratégia de filtro, executa.
        // Como o retorno principal aqui é lista, a filtragem pode ser feita no DAO
        String nomeClasse = entidade.getClass().getName();
        return daos.get(nomeClasse).consultar(entidade);
    }

    private String executarRegras(EntidadeDominio entidade, String operacao) {
        String nomeClasse = entidade.getClass().getName();
        StringBuilder mensagensErro = new StringBuilder();

        Map<String, List<IStrategy>> regrasClasse = rns.get(nomeClasse);
        if (regrasClasse != null) {
            List<IStrategy> regras = regrasClasse.get(operacao);
            if (regras != null) {
                for (IStrategy regra : regras) {
                    String erro = regra.processar(entidade);
                    if (erro != null) {
                        mensagensErro.append(erro).append("\n");
                    }
                }
            }
        }

        if (mensagensErro.length() > 0) {
            return mensagensErro.toString();
        }

        // Se passou em todas as regras, chama o DAO correspondente
        IDAO dao = daos.get(nomeClasse);
        if (dao != null) {
            if (operacao.equals("SALVAR")) dao.salvar(entidade);
            else if (operacao.equals("ALTERAR")) dao.alterar(entidade);
            else if (operacao.equals("EXCLUIR")) dao.deletar(entidade);
        }
        return null;
    }
}
