package app.app.adapters.in_web;

import app.app.domain.Candidato;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class BuscaCandidatoController {

    @GetMapping("/candidatos/buscar")
    public Candidato buscarCandidato(@RequestParam(required = false) String nome,
                                @RequestParam(required = false) String cargo,
                                @RequestParam(required = false) String partido){

        return new Candidato();
    }

    @GetMapping("/candidatos")
    public List<Candidato> listarAll(){
        return List.of();
    }
}
