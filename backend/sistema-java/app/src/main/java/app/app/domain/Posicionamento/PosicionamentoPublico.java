package app.app.domain.Posicionamento;

import app.app.domain.Candidato.Candidato;
import app.app.domain.Categoria.Categoria;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name = "posicionameto_publico")
public class PosicionamentoPublico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidato_id")
    @JsonIgnore
    private Candidato candidato;

    @Enumerated(EnumType.STRING)
    private Categoria categoria;
    private LocalDate data;

    //Talvez fazer um enum com as fontes (youtube, Twitter, Instagram...)
    private String fonte;
    private String link;
    private String resumo;
    private Float indiceDeCoerencia;
}
