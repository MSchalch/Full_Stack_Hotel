package br.com.hotel.controller;

import br.com.hotel.domain.Quarto;
import br.com.hotel.facade.IFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quartos")
public class CtrlQuarto {

    @Autowired
    private IFacade fachada;

    @PostMapping
    public ResponseEntity<String> salvar(@RequestBody Quarto quarto) {
        String erro = fachada.salvar(quarto);
        if (erro != null) {
            return ResponseEntity.badRequest().body(erro);
        }
        return ResponseEntity.ok("Quarto salvo com sucesso");
    }

    @PutMapping
    public ResponseEntity<String> alterar(@RequestBody Quarto quarto) {
        String erro = fachada.alterar(quarto);
        if (erro != null) {
            return ResponseEntity.badRequest().body(erro);
        }
        return ResponseEntity.ok("Quarto atualizado com sucesso");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> excluir(@PathVariable Long id) {
        Quarto quarto = new Quarto();
        quarto.setId(id);
        String erro = fachada.deletar(quarto);
        if (erro != null) {
            return ResponseEntity.badRequest().body(erro);
        }
        return ResponseEntity.ok("Quarto excluído com sucesso");
    }

    @GetMapping
    public ResponseEntity<?> consultar() {
        return ResponseEntity.ok(fachada.consultar(new Quarto()));
    }
}
