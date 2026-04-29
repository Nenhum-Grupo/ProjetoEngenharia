package app.app.DTO.CandidatoDetalhe.BucketResponse;

import app.app.domain.Categoria.Categoria;

import java.util.Set;

public record TopicoPlanoDTO(Categoria categoria, String resumoTopico, Integer numeroDePropostas, Set<PropostaDTO> propostas) {
}
