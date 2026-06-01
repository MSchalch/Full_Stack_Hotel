package br.com.hotel.controller;

import br.com.hotel.domain.PoliticaCancelamento;
import br.com.hotel.facade.IFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/politicas-cancelamento")
public class CtrlPoliticaCancelamento {

    @Autowired
    private IFacade fachada;

    @PostMapping
    public ResponseEntity<String> salvar(@RequestBody PoliticaCancelamento politica) {
        String erro = fachada.salvar(politica);
        if (erro != null) {
            return ResponseEntity.badRequest().body(erro);
        }
        return ResponseEntity.ok("Política salva com sucesso");
    }

    @GetMapping
    public ResponseEntity<?> consultar() {
        return ResponseEntity.ok(fachada.consultar(new PoliticaCancelamento()));
    }
}
