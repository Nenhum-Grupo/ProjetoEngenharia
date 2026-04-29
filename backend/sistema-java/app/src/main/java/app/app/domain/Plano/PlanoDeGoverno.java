package app.app.domain.Plano;

import app.app.domain.Candidato.Candidato;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Getter
@Builder
@Table(name = "plano_governo")
@NoArgsConstructor
@AllArgsConstructor
public class PlanoDeGoverno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "candidato_id")
    private Candidato candidato;
    private String resumo;
    private String bucketName;
    private String bucketKey;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "plano", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TopicoPlano> topicoPlanoList;

    public void adicionarTopico(TopicoPlano topico){
        this.topicoPlanoList.add(topico);
    }

}
