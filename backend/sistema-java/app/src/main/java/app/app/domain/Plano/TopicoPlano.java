package app.app.domain.Plano;

import app.app.domain.Categoria.Categoria;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "topico_plano")
public class TopicoPlano {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plano_id")
    @JsonIgnore
    private PlanoDeGoverno plano;

    @Enumerated(EnumType.STRING)
    private Categoria categoria;
    private String resumo;
    private Integer quantidadePropostas;
    private Float indiceDeCoerencia;

    @OneToMany(mappedBy = "topicoPlano", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<PropostaPlano> propostaPlanos;

    public void adicionarProposta(PropostaPlano proposta){
        this.propostaPlanos.add(proposta);
    }
}
