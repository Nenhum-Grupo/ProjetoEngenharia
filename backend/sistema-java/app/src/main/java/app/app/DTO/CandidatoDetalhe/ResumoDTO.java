package app.app.DTO.CandidatoDetalhe;

import app.app.domain.Plano.TopicoPlano;

import java.util.Set;

public record ResumoDTO(String resumo, Set<TopicoPlano> topicos) {
}
