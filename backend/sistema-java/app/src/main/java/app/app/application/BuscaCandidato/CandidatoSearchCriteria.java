package app.app.application.BuscaCandidato;

import app.app.domain.Candidato.Candidato;
import app.app.domain.Candidato.Cargo;
import org.springframework.data.jpa.domain.Specification;

public class CandidatoSearchCriteria {
    public static Specification<Candidato> ano(Integer anoInput){
        return (root, query, cb) -> cb.equal(root.get("anoDisputado"), anoInput);
    }
    public static Specification<Candidato> nome(String nomeInput){
        return (root, query, cb) -> cb.like(cb.lower(root.get("nome")), "%" + nomeInput.toLowerCase() + "%");
    }
    public static Specification<Candidato> partido(String partidoInput){
        return (root, query, cb) -> cb.like(cb.lower(root.get("partido")), "%" + partidoInput.toLowerCase() + "%");
    }
    public static Specification<Candidato> cargo(Cargo cargoInput){
        return (root, query, cb) -> cb.equal(root.get("cargo"), cargoInput);
    }
}
