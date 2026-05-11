package app.app.domain.Candidato;

import app.app.domain.Categoria.CategoriaClassification;
import app.app.domain.Plano.PlanoDeGoverno;
import app.app.domain.Posicionamento.PosicionamentoPublico;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.Set;


@Entity
@Getter
@Setter
@Table(name = "candidato")
public class Candidato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String partido;
    private String linkFoto;

    @Enumerated(EnumType.STRING)
    private Cargo cargo;

    private Float indiceDeCoerencia;
    private Integer anoDisputado;

    private String estado;
    private String cidade;

    @OneToMany(mappedBy = "candidato", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<CategoriaClassification> graficoRadar;

    @OneToOne(mappedBy = "candidato", orphanRemoval = true)
    private PlanoDeGoverno planoDeGoverno;

    @Enumerated(EnumType.STRING)
    private CategoriaEspectroPolitico categoriaEspectroPolitico;

    @OneToMany(mappedBy = "candidato", orphanRemoval = true)
    private List<PosicionamentoPublico> posicionamentoPublicoList;
}
