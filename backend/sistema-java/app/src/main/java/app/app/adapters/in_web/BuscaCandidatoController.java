package app.app.adapters.in_web;

import app.app.adapters.in_web.DTO.BuscarCandidatoDTO;
import app.app.application.BuscaCandidato.ConsultaCandidatoService;
import app.app.domain.Candidato.Candidato;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
                buscarCandidatoDTO.cargo()
        );
        return ResponseEntity.ok(candidatoList);
    }
}
