package br.com.hotel.controller;

import br.com.hotel.domain.Reserva;
import br.com.hotel.facade.IFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservas")
public class CtrlReserva {

    @Autowired
    private IFacade fachada;

    @PostMapping
    public ResponseEntity<String> salvar(@RequestBody Reserva reserva) {
        String erro = fachada.salvar(reserva);
        if (erro != null) {
            return ResponseEntity.badRequest().body(erro);
        }
        return ResponseEntity.ok("Reserva criada com sucesso");
    }

    @PutMapping
    public ResponseEntity<String> alterar(@RequestBody Reserva reserva) {
        String erro = fachada.alterar(reserva);
        if (erro != null) {
            return ResponseEntity.badRequest().body(erro);
        }
        return ResponseEntity.ok("Reserva atualizada com sucesso");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> excluir(@PathVariable Long id) {
        Reserva reserva = new Reserva();
        reserva.setId(id);
        String erro = fachada.deletar(reserva);
        if (erro != null) {
            return ResponseEntity.badRequest().body(erro);
        }
        return ResponseEntity.ok("Reserva cancelada/excluída com sucesso");
    }

    @GetMapping
    public ResponseEntity<?> consultar(@RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(fachada.consultarPaginado(new Reserva(), page, size));
    }
}
