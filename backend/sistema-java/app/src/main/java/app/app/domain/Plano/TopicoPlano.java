package app.app.domain.Plano;

import app.app.domain.Categoria.Categoria;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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
    private PlanoDeGoverno plano;

    @Enumerated(EnumType.STRING)
    private Categoria categoria;
    private String resumo;
    private Float indiceDeCoerencia;
}
