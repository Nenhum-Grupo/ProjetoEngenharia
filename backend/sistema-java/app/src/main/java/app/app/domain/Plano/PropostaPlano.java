package app.app.domain.Plano;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "proposta_plano")
public class PropostaPlano {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topico_plano_id")
    @JsonIgnore
    private TopicoPlano topicoPlano;

    private String proposta;
    private String ideia;
    private String formaImplementacao;
}
