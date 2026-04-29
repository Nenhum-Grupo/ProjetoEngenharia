package app.app.DTO;

import app.app.domain.Candidato.Candidato;

import java.util.List;

public record RetornarBuscaCandidatoDTO(List<Candidato> candidatos, List<String> estados, List<String> cidades, List<String> listPartidos){
}
