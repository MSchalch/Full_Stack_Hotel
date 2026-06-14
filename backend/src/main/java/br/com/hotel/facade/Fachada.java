package br.com.hotel.facade;

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
        rnsSalvarHospede.add(new ValidarMenorDeIdadeStrategy(entityManager));

        List<IStrategy> rnsAlterarHospede = new ArrayList<>();
        rnsAlterarHospede.add(new PreencherEnderecoPorCepStrategy(viaCepService));
        rnsAlterarHospede.add(new ValidarDadosObrigatoriosHospedeStrategy());
        rnsAlterarHospede.add(new ValidarFormatoEmailStrategy());
        rnsAlterarHospede.add(new VerificarCPFStrategy());
        rnsAlterarHospede.add(new ValidarCpfUnicoStrategy(entityManager));
        rnsAlterarHospede.add(new ValidarMenorDeIdadeStrategy(entityManager));

        Map<String, List<IStrategy>> rnsHospede = new HashMap<>();
        rnsHospede.put("SALVAR", rnsSalvarHospede);
        rnsHospede.put("ALTERAR", rnsAlterarHospede);
        
        List<IStrategy> rnsExcluirHospede = new ArrayList<>();
        rnsExcluirHospede.add(new ValidarExclusaoHospedeResponsavelStrategy(entityManager));
        rnsHospede.put("EXCLUIR", rnsExcluirHospede);
        
        rnsHospede.put("CONSULTAR", new ArrayList<>()); // vazio por enquanto

        rns.put(Hospede.class.getName(), rnsHospede);
        
        // 3. Instanciando Strategies de Quarto
        List<IStrategy> rnsSalvarQuarto = new ArrayList<>();
        rnsSalvarQuarto.add(new ValidarDadosObrigatoriosQuartoStrategy());
        rnsSalvarQuarto.add(new ValidarValoresPositivosQuartoStrategy());
        rnsSalvarQuarto.add(new ValidarCapacidadeQuartosPadraoStrategy());
        rnsSalvarQuarto.add(new ValidarNumeroQuartoUnicoStrategy(entityManager));

        List<IStrategy> rnsAlterarQuarto = new ArrayList<>();
        rnsAlterarQuarto.add(new ValidarDadosObrigatoriosQuartoStrategy());
        rnsAlterarQuarto.add(new ValidarValoresPositivosQuartoStrategy());
        rnsAlterarQuarto.add(new ValidarCapacidadeQuartosPadraoStrategy());
        rnsAlterarQuarto.add(new ValidarNumeroQuartoUnicoStrategy(entityManager));

        List<IStrategy> rnsExcluirQuarto = new ArrayList<>();
        rnsExcluirQuarto.add(new ValidarExclusaoQuartoStrategy(entityManager));

        Map<String, List<IStrategy>> rnsQuarto = new HashMap<>();
        rnsQuarto.put("SALVAR", rnsSalvarQuarto);
        rnsQuarto.put("ALTERAR", rnsAlterarQuarto);
        rnsQuarto.put("EXCLUIR", rnsExcluirQuarto);
        rnsQuarto.put("CONSULTAR", new ArrayList<>());

        rns.put(Quarto.class.getName(), rnsQuarto);
        
        // 4. Instanciando Strategies de Reserva
        List<IStrategy> rnsSalvarReserva = new ArrayList<>();
        rnsSalvarReserva.add(new ValidarDadosObrigatoriosReservaStrategy());
        rnsSalvarReserva.add(new ValidarDatasReservaStrategy());
        rnsSalvarReserva.add(new ValidarCapacidadeQuartoReservaStrategy(entityManager));
        rnsSalvarReserva.add(new ValidarDisponibilidadeQuartoStrategy(entityManager));
        rnsSalvarReserva.add(new CalcularValorTotalReservaStrategy(entityManager));

        List<IStrategy> rnsAlterarReserva = new ArrayList<>();
        rnsAlterarReserva.add(new ValidarDadosObrigatoriosReservaStrategy());
        rnsAlterarReserva.add(new ValidarDatasReservaStrategy());
        rnsAlterarReserva.add(new ValidarCapacidadeQuartoReservaStrategy(entityManager));
        rnsAlterarReserva.add(new ValidarDisponibilidadeQuartoStrategy(entityManager));
        rnsAlterarReserva.add(new CalcularValorTotalReservaStrategy(entityManager));

        Map<String, List<IStrategy>> rnsReserva = new HashMap<>();
        rnsReserva.put("SALVAR", rnsSalvarReserva);
        rnsReserva.put("ALTERAR", rnsAlterarReserva);
        rnsReserva.put("EXCLUIR", new ArrayList<>());
        rnsReserva.put("CONSULTAR", new ArrayList<>());
        rns.put(Reserva.class.getName(), rnsReserva);
        
        // Regras para Pagamento
        List<IStrategy> rnsSalvarPagamento = new ArrayList<>();
        rnsSalvarPagamento.add(new ValidarDadosPagamentoStrategy());
        rnsSalvarPagamento.add(new ValidarPagamentoDuplicadoStrategy(entityManager));
        rnsSalvarPagamento.add(new DefinirDataOperacaoStrategy());
        rnsSalvarPagamento.add(new AtualizarStatusReservaPagamentoStrategy(entityManager));
        
        List<IStrategy> rnsAlterarPagamento = new ArrayList<>();
        rnsAlterarPagamento.add(new ValidarDadosPagamentoStrategy());
        rnsAlterarPagamento.add(new AtualizarStatusReservaPagamentoStrategy(entityManager));
        
        Map<String, List<IStrategy>> rnsPagamento = new HashMap<>();
        rnsPagamento.put("SALVAR", rnsSalvarPagamento);
        rnsPagamento.put("ALTERAR", rnsAlterarPagamento);
        rnsPagamento.put("CONSULTAR", new ArrayList<>());
        rnsPagamento.put("EXCLUIR", new ArrayList<>());
        rns.put(Pagamento.class.getName(), rnsPagamento);
        
        // 6. Instanciando Strategies de Promocao
        List<IStrategy> rnsSalvarPromocao = new ArrayList<>();
        rnsSalvarPromocao.add(new ValidarRegrasPromocaoStrategy());
        
        List<IStrategy> rnsAlterarPromocao = new ArrayList<>();
        rnsAlterarPromocao.add(new ValidarRegrasPromocaoStrategy());
        
        List<IStrategy> rnsExcluirPromocao = new ArrayList<>();
        rnsExcluirPromocao.add(new ValidarExclusaoPromocaoStrategy(entityManager));
        
        Map<String, List<IStrategy>> rnsPromocao = new HashMap<>();
        rnsPromocao.put("SALVAR", rnsSalvarPromocao);
        rnsPromocao.put("ALTERAR", rnsAlterarPromocao);
        rnsPromocao.put("EXCLUIR", rnsExcluirPromocao);
        rnsPromocao.put("CONSULTAR", new ArrayList<>());
        
        rns.put(Promocao.class.getName(), rnsPromocao);
        
        // 7. Instanciando Strategies de Politica de Cancelamento
        List<IStrategy> rnsSalvarPolitica = new ArrayList<>();
        rnsSalvarPolitica.add(new ValidarDadosObrigatoriosPoliticaStrategy());
        rnsSalvarPolitica.add(new ValidarValoresPoliticaStrategy());

        List<IStrategy> rnsAlterarPolitica = new ArrayList<>();
        rnsAlterarPolitica.add(new ValidarDadosObrigatoriosPoliticaStrategy());
        rnsAlterarPolitica.add(new ValidarValoresPoliticaStrategy());

        List<IStrategy> rnsExcluirPolitica = new ArrayList<>();
        rnsExcluirPolitica.add(new ValidarExclusaoPoliticaStrategy(entityManager));

        Map<String, List<IStrategy>> rnsPolitica = new HashMap<>();
        rnsPolitica.put("SALVAR", rnsSalvarPolitica);
        rnsPolitica.put("ALTERAR", rnsAlterarPolitica);
        rnsPolitica.put("EXCLUIR", rnsExcluirPolitica);
        rnsPolitica.put("CONSULTAR", new ArrayList<>());

        rns.put(PoliticaCancelamento.class.getName(), rnsPolitica);


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
