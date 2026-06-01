package br.com.hotel.controller;

import br.com.hotel.domain.Pagamento;
import br.com.hotel.facade.IFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pagamentos")
public class CtrlPagamento {

    @Autowired
    private IFacade fachada;

    @PostMapping
    public ResponseEntity<String> salvar(@RequestBody Pagamento pagamento) {
        String erro = fachada.salvar(pagamento);
        if (erro != null) {
            return ResponseEntity.badRequest().body(erro);
        }
        return ResponseEntity.ok("Pagamento salvo com sucesso");
    }

    @GetMapping
    public ResponseEntity<?> consultar() {
        return ResponseEntity.ok(fachada.consultar(new Pagamento()));
    }
}
