package app.app.domain.Candidato;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidatoJpaRepository extends JpaRepository<Candidato, Long>, JpaSpecificationExecutor<Candidato> {
    @Query("select distinct c.anoDisputado from Candidato c where c.anoDisputado is not null order by c.anoDisputado desc")
    List<Integer> getAnosDistintos();

    @Query("select distinct c.partido from Candidato c where c.partido is not null order by c.partido desc")
    List<String> getPartidosDistintos();

    @Query("select distinct c.estado from Candidato c where c.estado is not null order by c.estado desc")
    List<String> getEstadosDistintos();

    @Query("select distinct c.cidade from Candidato c where c.cidade is not null order by c.cidade desc")
    List<String> getCidadesDistintos();
}
