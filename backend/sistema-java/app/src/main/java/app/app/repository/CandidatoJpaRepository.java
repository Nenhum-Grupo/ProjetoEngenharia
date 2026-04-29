package app.app.repository;

import app.app.domain.Candidato.Candidato;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidatoJpaRepository extends JpaRepository<Candidato, Long>, JpaSpecificationExecutor<Candidato> {
    @Query("select distinct c.anoDisputado from Candidato c where c.anoDisputado is not null order by c.anoDisputado desc")
    List<Integer> getAnosDistintos();

    @EntityGraph(attributePaths = {"planoDeGoverno", "graficoRadar", "posicionamentoPublicoList"})
    Optional<Candidato> findById(Long id);

}
