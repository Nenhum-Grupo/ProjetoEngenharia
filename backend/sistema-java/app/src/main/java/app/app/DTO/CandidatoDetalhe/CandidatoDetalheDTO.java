package app.app.DTO.CandidatoDetalhe;

import app.app.domain.Candidato.Cargo;
import app.app.domain.Candidato.CategoriaEspectroPolitico;
import app.app.domain.Categoria.Categoria;
import app.app.domain.Categoria.CategoriaClassification;
import app.app.domain.Posicionamento.PosicionamentoPublico;

import java.util.List;
import java.util.Set;

public record CandidatoDetalheDTO(String nome,
                                  String partido,
                                  String linkFoto,
                                  Cargo cargo,
                                  Float indiceDeCoerencia,
                                  String estado,
                                  String cidade,
                                  CategoriaEspectroPolitico categoriaEspectroPolitico,
                                  Set<CategoriaClassification> graficoRadar,
                                  List<PosicionamentoPublico> posicionamentoPublicoList,
                                  String resumoGeral) {
}
