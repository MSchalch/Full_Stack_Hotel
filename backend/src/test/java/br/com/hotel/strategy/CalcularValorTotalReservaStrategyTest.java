package br.com.hotel.strategy;

import br.com.hotel.domain.Promocao;
import br.com.hotel.domain.Quarto;
import br.com.hotel.domain.Reserva;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.mockito.Mockito;
import jakarta.persistence.EntityManager;

class CalcularValorTotalReservaStrategyTest {

    private CalcularValorTotalReservaStrategy strategy;
    private Reserva reserva;
    private Quarto quarto;
    private EntityManager entityManager;

    @BeforeEach
    void setUp() {
        entityManager = Mockito.mock(EntityManager.class);
        strategy = new CalcularValorTotalReservaStrategy(entityManager);
        reserva = new Reserva();
        quarto = new Quarto();
        quarto.setId(1L);
        quarto.setPrecoBase(new BigDecimal("100.00"));
        reserva.setQuarto(quarto);
        reserva.setCheckIn(LocalDateTime.of(2023, 10, 1, 14, 0));
        reserva.setCheckOut(LocalDateTime.of(2023, 10, 5, 12, 0)); // 4 diárias = R$ 400.00
        
        Mockito.when(entityManager.find(Quarto.class, 1L)).thenReturn(quarto);
    }

    @Test
    void processar_SemPromocao_DeveCalcularApenasDiarias() {
        String resultado = strategy.processar(reserva);

        assertNull(resultado);
        assertEquals(0, new BigDecimal("400.00").compareTo(reserva.getValorTotal()));
    }

    @Test
    void processar_ComDescontoPercentual_DeveAplicarDesconto() {
        Promocao promocao = new Promocao();
        promocao.setId(1L);
        promocao.setAtivo(true);
        promocao.setPorcentagem(10.0f); // 10% de desconto
        reserva.setPromocao(promocao);
        Mockito.when(entityManager.find(Promocao.class, 1L)).thenReturn(promocao);

        String resultado = strategy.processar(reserva);

        assertNull(resultado);
        // 400 - 10% (40) = 360
        assertEquals(0, new BigDecimal("360.00").compareTo(reserva.getValorTotal()));
    }

    @Test
    void processar_ComDescontoValorFixo_DeveSubtrairValor() {
        Promocao promocao = new Promocao();
        promocao.setId(2L);
        promocao.setAtivo(true);
        promocao.setValorDesconto(new BigDecimal("50.00")); // -50 reais
        reserva.setPromocao(promocao);
        Mockito.when(entityManager.find(Promocao.class, 2L)).thenReturn(promocao);

        String resultado = strategy.processar(reserva);

        assertNull(resultado);
        // 400 - 50 = 350
        assertEquals(0, new BigDecimal("350.00").compareTo(reserva.getValorTotal()));
    }

    @Test
    void processar_ComDescontoPercentualEValorFixo_DeveAplicarAmbos() {
        Promocao promocao = new Promocao();
        promocao.setId(3L);
        promocao.setAtivo(true);
        promocao.setPorcentagem(10.0f); // -10% -> 400 vira 360
        promocao.setValorDesconto(new BigDecimal("60.00")); // 360 - 60 = 300
        reserva.setPromocao(promocao);
        Mockito.when(entityManager.find(Promocao.class, 3L)).thenReturn(promocao);

        String resultado = strategy.processar(reserva);

        assertNull(resultado);
        assertEquals(0, new BigDecimal("300.00").compareTo(reserva.getValorTotal()));
    }

    @Test
    void processar_ComCheckinECheckoutNoMesmoDia_DeveCobrarUmaDiaria() {
        reserva.setCheckIn(LocalDateTime.of(2023, 10, 1, 14, 0));
        reserva.setCheckOut(LocalDateTime.of(2023, 10, 1, 20, 0)); 
        
        String resultado = strategy.processar(reserva);

        assertNull(resultado);
        assertEquals(0, new BigDecimal("100.00").compareTo(reserva.getValorTotal()));
    }
}
