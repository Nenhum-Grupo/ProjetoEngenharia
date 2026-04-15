package app.app.Domain;

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

    //talvez uma classe para categoria
    private String categoria;
    private String resumo;
    private Float indiceDeCoerencia;
}
