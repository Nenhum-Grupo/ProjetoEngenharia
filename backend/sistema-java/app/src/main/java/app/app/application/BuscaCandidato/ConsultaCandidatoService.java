package app.app.application.BuscaCandidato;

import app.app.domain.Candidato.Candidato;
import app.app.application.port.CandidatoRepository;
import app.app.domain.Candidato.Cargo;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConsultaCandidatoService {

    private final CandidatoRepository candidatoRepository;

    public ConsultaCandidatoService(CandidatoRepository candidatoRepository) {
        this.candidatoRepository = candidatoRepository;
    }


    //tratar melhor condicoes de erro e regras de negocio
    public List<Candidato> listarComCriteria(String nome, Integer ano, String partido, Cargo cargo){
        Specification<Candidato> spec = Specification.where(null);

        if(nome != null && !nome.isBlank()){
            spec = spec.and(CandidatoSearchCriteria.nome(nome));
        }
        if(ano != null){
            spec = spec.and(CandidatoSearchCriteria.ano(ano));
        }
        if(partido != null && !partido.isBlank()){
            spec = spec.and(CandidatoSearchCriteria.partido(partido));
        }
        if(cargo != null){
            spec = spec.and(CandidatoSearchCriteria.cargo(cargo));
        }

        return this.candidatoRepository.listar(spec);
    }

}
