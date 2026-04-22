package app.app.adapters.in_web.DTO;

import app.app.domain.Candidato.Cargo;

public record BuscarCandidatoDTO(String nome, Integer ano, String partido, Cargo cargo) {
    public BuscarCandidatoDTO {
        ano = ano==null?2022:ano;
    }
}
