package app.app.controllers;

import app.app.DTO.BuscarCandidatoDTO;
import app.app.DTO.RetornarBuscaCandidatoDTO;
import app.app.services.BuscaCandidato.ConsultaCandidatoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class BuscaCandidatoController {

    @Autowired
    private ConsultaCandidatoService consultaCandidatoService;

    @PostMapping("/candidatos")
    public ResponseEntity<RetornarBuscaCandidatoDTO> buscarCandidato(@RequestBody BuscarCandidatoDTO buscarCandidatoDTO){
        RetornarBuscaCandidatoDTO result = this.consultaCandidatoService.listarComCriteria(
                buscarCandidatoDTO.nome(),
                buscarCandidatoDTO.ano(),
                buscarCandidatoDTO.partido(),
                buscarCandidatoDTO.cargo(),
                buscarCandidatoDTO.estado(),
                buscarCandidatoDTO.cidade()
        );
        return ResponseEntity.ok(result);
    }

    @GetMapping("/candidatos/anos")
    public ResponseEntity<List<Integer>> getAnos(){
        List<Integer> anos = consultaCandidatoService.listarAnos();
        return ResponseEntity.ok(anos);
    }
}
