package app.app.domain.Categoria;

import app.app.domain.Candidato.Candidato;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name="categoria_classification")
public class CategoriaClassification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidato_id")
    @JsonIgnore
    private Candidato candidato;

    @Enumerated(EnumType.STRING)
    private Categoria categoria;

    private Float percentual;
}