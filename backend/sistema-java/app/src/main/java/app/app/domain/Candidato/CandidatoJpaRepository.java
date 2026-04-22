package app.app.domain.Candidato;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidatoJpaRepository extends JpaRepository<Candidato, Long>, JpaSpecificationExecutor<Candidato> {

}
