package app.app.DTO;

import app.app.domain.Candidato.Cargo;

public record BuscarCandidatoDTO(String nome, Integer ano, String partido, Cargo cargo, String estado, String cidade) {
    public BuscarCandidatoDTO {
        ano = ano==null?2022:ano;
    }
}
