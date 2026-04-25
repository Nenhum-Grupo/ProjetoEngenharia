package app.app.application.port;

import app.app.domain.Candidato.Candidato;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public interface CandidatoRepository {
    List<Candidato> listar(Specification<Candidato> spec);
    List<Integer> listarAnos();
    List<String> listarPartido();
    List<String> listarEstado();
    List<String> listarCidade();
}
