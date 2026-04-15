package app.app.infra.adapters.in.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BuscaCandidatoController {

    @GetMapping("/candidatos/buscar")
    public void buscarCandidato(@RequestParam(required = false) String nome,
                                @RequestParam(required = false) String cargo,
                                @RequestParam(required = false) String partido){

    }

    @GetMapping("/candidatos")
    public void listarAll(){
    }
}
