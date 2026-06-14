package br.com.hotel.controller;

import br.com.hotel.domain.Hospede;
import br.com.hotel.facade.IFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hospedes")
public class CtrlHospede {

    @Autowired
    private IFacade fachada;

    @PostMapping
    public ResponseEntity<String> salvar(@RequestBody Hospede hospede) {
        String erro = fachada.salvar(hospede);
        if (erro != null) {
            return ResponseEntity.badRequest().body(erro);
        }
        return ResponseEntity.ok("Hóspede cadastrado com sucesso");
    }

    @PutMapping
    public ResponseEntity<String> alterar(@RequestBody Hospede hospede) {
        String erro = fachada.alterar(hospede);
        if (erro != null) {
            return ResponseEntity.badRequest().body(erro);
        }
        return ResponseEntity.ok("Hóspede atualizado com sucesso");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> excluir(@PathVariable Long id) {
        Hospede hospede = new Hospede();
        hospede.setId(id);
        String erro = fachada.deletar(hospede);
        if (erro != null) {
            return ResponseEntity.badRequest().body(erro);
        }
        return ResponseEntity.ok("Hóspede excluído com sucesso");
    }

    @GetMapping
    public ResponseEntity<?> consultar(@RequestParam(required = false) String termo,
                                       @RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "10") int size) {
        Hospede hospedeFiltro = new Hospede();
        if (termo != null && !termo.trim().isEmpty()) {
            hospedeFiltro.setNomeCompleto(termo);
        }
        return ResponseEntity.ok(fachada.consultarPaginado(hospedeFiltro, page, size));
    }
}
