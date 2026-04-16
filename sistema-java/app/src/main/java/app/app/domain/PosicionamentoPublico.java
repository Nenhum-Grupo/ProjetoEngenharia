package app.app.domain;

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
    private Candidato candidato;

    //Talvez fazer uma classe com as categorias
    private String Categoria;
    private LocalDate data;

    //Talvez fazer um enum com as fontes (youtube, Twitter, Instagram...)
    private String fonte;
    private String link;
    private String resumo;
    private Float indiceDeCoerencia;
}
