package app.app.adapters.in_web;

import app.app.adapters.in_web.DTO.BuscarCandidatoDTO;
import app.app.application.BuscaCandidato.ConsultaCandidatoService;
import app.app.domain.Candidato.Candidato;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.xml.transform.Result;
import java.util.List;

@RestController
public class BuscaCandidatoController {

    @Autowired
    private ConsultaCandidatoService consultaCandidatoService;

    @PostMapping("/candidatos")
    public ResponseEntity<List<Candidato>> buscarCandidato(@RequestBody BuscarCandidatoDTO buscarCandidatoDTO){
        List<Candidato> candidatoList = this.consultaCandidatoService.listarComCriteria(
                buscarCandidatoDTO.nome(),
                buscarCandidatoDTO.ano(),
                buscarCandidatoDTO.partido(),
                buscarCandidatoDTO.cargo(),
                buscarCandidatoDTO.estado(),
                buscarCandidatoDTO.cidade()
        );
        return ResponseEntity.ok(candidatoList);
    }

    @GetMapping("/candidatos/anos")
    public ResponseEntity<List<Integer>> getAnos(){
        List<Integer> anos = consultaCandidatoService.listarAnos();
        return ResponseEntity.ok(anos);
    }

    @GetMapping("/candidatos/partidos")
    public ResponseEntity<List<String>> getPartidos(){
        List<String> partidos = consultaCandidatoService.listarPartidos();
        return ResponseEntity.ok(partidos);
    }

    @GetMapping("/candidatos/estados")
    public ResponseEntity<List<String>> getEstados(){
        List<String> estados = consultaCandidatoService.listarEstados();
        return ResponseEntity.ok(estados);
    }

    @GetMapping("/candidatos/cidades")
    public ResponseEntity<List<String>> getCidades(){
        List<String> cidades = consultaCandidatoService.listarCidades();
        return ResponseEntity.ok(cidades);
    }
}
