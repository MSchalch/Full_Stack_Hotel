package br.com.hotel.controller;

import br.com.hotel.domain.Promocao;
import br.com.hotel.facade.IFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/promocao")
@CrossOrigin(origins = "*")
public class CtrlPromocao {

    @Autowired
    private IFacade fachada;

    @PostMapping
    public ResponseEntity<String> salvar(@RequestBody Promocao promocao) {
        String erro = fachada.salvar(promocao);
        if (erro != null) {
            return ResponseEntity.badRequest().body(erro);
        }
        return ResponseEntity.ok("Promoção salva com sucesso!");
    }

    @PutMapping
    public ResponseEntity<String> alterar(@RequestBody Promocao promocao) {
        String erro = fachada.alterar(promocao);
        if (erro != null) {
            return ResponseEntity.badRequest().body(erro);
        }
        return ResponseEntity.ok("Promoção alterada com sucesso!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> excluir(@PathVariable Long id) {
        Promocao promocao = new Promocao();
        promocao.setId(id);
        String erro = fachada.deletar(promocao);
        if (erro != null) {
            return ResponseEntity.badRequest().body(erro);
        }
        return ResponseEntity.ok("Promoção inativada com sucesso!");
    }

    @GetMapping
    public ResponseEntity<?> consultar() {
        return ResponseEntity.ok(fachada.consultar(new Promocao()));
    }
}
