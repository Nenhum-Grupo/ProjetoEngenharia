package app.app.adapters.out_persistence;

import app.app.domain.Candidato.Candidato;
import app.app.application.port.CandidatoRepository;
import app.app.domain.Candidato.CandidatoJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CandidatoRepositoryImpl implements CandidatoRepository {

    @Autowired
    private CandidatoJpaRepository candidatoJpaRepository;

    @Override
    public List<Candidato> listar(Specification<Candidato> spec) {
        return candidatoJpaRepository.findAll(spec);
    }

    @Override
    public List<Integer> listarAnos() {return candidatoJpaRepository.getAnosDistintos();}

    @Override
    public List<String> listarPartido() {return candidatoJpaRepository.getPartidosDistintos();}

    @Override
    public List<String> listarEstado() {return candidatoJpaRepository.getEstadosDistintos();}

    @Override
    public List<String> listarCidade() {return candidatoJpaRepository.getCidadesDistintos();}
}
