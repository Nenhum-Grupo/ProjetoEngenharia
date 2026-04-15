package app.app.Domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

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

    //Talvez fazer um enum com os Possiveis Cargos
    private String cargo;
    private Float indiceDeCoerencia;

    /*Pensar em como implementar o Grafico de Radar, Lista de Qualidades
    Ou uma classe grafico com as qualidades, a ideia eh que cada Categoria
    do Plano receba uma porcentagem com base no qunato eh abordada considerando
    plano + posicionamentos publicos*/

    @OneToOne(mappedBy = "candidato")
    private PlanoDeGoverno planoDeGoverno;

    @Enumerated(EnumType.STRING)
    private CategoriaEspectroPolitico categoriaEspectroPolitico;

    @OneToMany(mappedBy = "candidato")
    private List<PosicionamentoPublico> posicionamentoPublicoList;

}
