package app.app.repository;

import app.app.domain.Plano.PlanoDeGoverno;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResumoJpaRepository extends JpaRepository<PlanoDeGoverno, Long> {
    @EntityGraph(attributePaths = {"topicoPlanoList", "topicoPlanoList.propostaPlanos"})
    Optional<PlanoDeGoverno> findByCandidatoId(Long id);
}
