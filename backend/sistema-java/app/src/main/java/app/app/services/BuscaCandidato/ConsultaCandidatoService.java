package app.app.services.BuscaCandidato;

import app.app.DTO.RetornarBuscaCandidatoDTO;
import app.app.domain.Candidato.Candidato;
import app.app.domain.Candidato.Cargo;
import app.app.repository.CandidatoJpaRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ConsultaCandidatoService {

    private final CandidatoJpaRepository candidatoRepository;

    public ConsultaCandidatoService(CandidatoJpaRepository candidatoRepository) {
        this.candidatoRepository = candidatoRepository;
    }

    public RetornarBuscaCandidatoDTO listarComCriteria(String nome, Integer ano, String partido, Cargo cargo, String estado, String cidade){
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
        if(estado != null){
            spec = spec.and(CandidatoSearchCriteria.estado(estado));
        }
        if(cidade != null){
            spec = spec.and(CandidatoSearchCriteria.cidade(cidade));
        }

        List<Candidato> listCandidato = this.candidatoRepository.findAll(spec);
        List<String> listEstados = new ArrayList<>();
        List<String>  listCidades = new ArrayList<>();
        List<String> listPartidos = listCandidato.stream().map(Candidato::getPartido).toList();

        if(cargo == null){
            if(estado == null){
                listEstados = listCandidato.stream().map(Candidato::getEstado).distinct().toList();
            }
            else{
                listCidades = listCandidato.stream().map(Candidato::getCidade).distinct().toList();
            }
        }
        else{
            if(cargo != Cargo.PRESIDENTE){
                listEstados = listCandidato.stream().map(Candidato::getEstado).distinct().toList();
            }
            if(cargo == Cargo.VEREADOR || cargo == Cargo.PREFEITO){
                listCidades = listCandidato.stream().map(Candidato::getCidade).distinct().toList();
            }
        }

        return new RetornarBuscaCandidatoDTO(listCandidato, listEstados, listCidades, listPartidos);
    }

    public List<Integer> listarAnos(){
        return candidatoRepository.getAnosDistintos();
    }

}
