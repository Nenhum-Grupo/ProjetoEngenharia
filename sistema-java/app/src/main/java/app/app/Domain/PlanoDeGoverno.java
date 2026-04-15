package app.app.Domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "plano_governo")
public class PlanoDeGoverno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //Pensar em colocar um Atributo sobre o link onde o plano esta armazenado para analises futuras

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidato_id")
    private Candidato candidato;
    private String resumo;

    @OneToMany(mappedBy = "plano")
    private List<TopicoPlano> topicoPlanoList;

}
