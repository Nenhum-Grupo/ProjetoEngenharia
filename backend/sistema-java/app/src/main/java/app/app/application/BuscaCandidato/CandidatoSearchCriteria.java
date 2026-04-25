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
        return (root, query, cb) -> cb.equal(root.get("partido"), partidoInput);
    }
    public static Specification<Candidato> cargo(Cargo cargoInput){
        return (root, query, cb) -> cb.equal(root.get("cargo"), cargoInput);
    }
    public static Specification<Candidato> estado(String estadoInput){
        return (root, query, cb) -> cb.equal(root.get("estado"), estadoInput);
    }
    public static Specification<Candidato> cidade(String cidadeInput){
        return (root, query, cb) -> cb.equal(root.get("cidade"), cidadeInput);
    }
}
