package br.com.hotel.controller;

import br.com.hotel.domain.Relatorio;
import br.com.hotel.facade.IFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/relatorios")
public class CtrlRelatorio {

    @Autowired
    private IFacade fachada;

    @GetMapping
    public ResponseEntity<?> consultar() {
        return ResponseEntity.ok(fachada.consultar(new Relatorio()));
    }
}
