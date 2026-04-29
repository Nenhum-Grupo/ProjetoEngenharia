package app.app.DTO.CandidatoDetalhe.BucketResponse;

import java.util.List;
import java.util.Set;

public record PlanoGovernoDTO(String resumoGeral, Set<TopicoPlanoDTO> topicos) {
}
