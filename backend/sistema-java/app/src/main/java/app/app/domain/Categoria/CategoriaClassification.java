package app.app.domain.Categoria;

import app.app.domain.Candidato.Candidato;
import jakarta.persistence.*;

@Entity
@Table(name="categoria_classification")
public class CategoriaClassification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidato_id")
    private Candidato candidato;

    @Enumerated(EnumType.STRING)
    private Categoria categoria;

    private Float percentual;
}
