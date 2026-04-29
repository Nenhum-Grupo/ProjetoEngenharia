package app.app.controllers;


import app.app.DTO.CandidatoDetalhe.CandidatoDetalheDTO;
import app.app.DTO.CandidatoDetalhe.ResumoDTO;
import app.app.DTO.CandidatoDetalhe.SaveResumoDTO;
import app.app.domain.Candidato.Candidato;
import app.app.domain.Plano.PlanoDeGoverno;
import app.app.services.CandidatoDetalhe.CandidatoDetalheService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class CandidatoController {

    @Autowired
    private CandidatoDetalheService candidatoDetalheService;


    @GetMapping("/candidato/{id}")
    public ResponseEntity<CandidatoDetalheDTO> getCandidato(@PathVariable Long id){
        CandidatoDetalheDTO candidato = candidatoDetalheService.getCandidato(id);
        return ResponseEntity.ok(candidato);
    }

    @PostMapping("/resumo")
    public void salvarOrigemResumo(@RequestBody SaveResumoDTO resumoDTO) throws JsonProcessingException {
        candidatoDetalheService.salvarResumo(resumoDTO.id(), resumoDTO.bucketName(), resumoDTO.bucketKey());
    }

    @GetMapping("/candidato/{id}/plano")
    public ResponseEntity<ResumoDTO> getResumoCandidato(@PathVariable Long id){
        ResumoDTO p = candidatoDetalheService.getResumo(id);
        return ResponseEntity.ok(p);
    }
}
