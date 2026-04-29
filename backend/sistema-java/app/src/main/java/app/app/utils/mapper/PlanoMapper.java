package app.app.utils.mapper;

import app.app.DTO.CandidatoDetalhe.BucketResponse.PlanoGovernoDTO;
import app.app.DTO.CandidatoDetalhe.BucketResponse.PropostaDTO;
import app.app.DTO.CandidatoDetalhe.BucketResponse.TopicoPlanoDTO;
import app.app.domain.Candidato.Candidato;
import app.app.domain.Plano.PlanoDeGoverno;
import app.app.domain.Plano.PropostaPlano;
import app.app.domain.Plano.TopicoPlano;

import java.util.ArrayList;
import java.util.HashSet;

public class PlanoMapper {


    public PlanoDeGoverno toEntity(PlanoGovernoDTO planoGovernoDTO, Candidato candidato, String bucketName, String bucketKey){
        PlanoDeGoverno plano = PlanoDeGoverno.builder().
                candidato(candidato).
                resumo(planoGovernoDTO.resumoGeral()).
                bucketName(bucketName).
                bucketKey(bucketKey).
                topicoPlanoList(new HashSet<>()).
                build();

        for(TopicoPlanoDTO topicoPlanoDTO : planoGovernoDTO.topicos()){
            TopicoPlano topico = this.toTopico(topicoPlanoDTO, plano);
            plano.adicionarTopico(topico);
        }
        return plano;
    }



    private TopicoPlano toTopico(TopicoPlanoDTO topicoPlanoDTO, PlanoDeGoverno planoDeGoverno){
        TopicoPlano topico = new TopicoPlano();
        topico.setCategoria(topicoPlanoDTO.categoria());
        topico.setResumo(topicoPlanoDTO.resumoTopico());
        topico.setQuantidadePropostas(topicoPlanoDTO.numeroDePropostas());
        topico.setPropostaPlanos(new HashSet<>());
        topico.setPlano(planoDeGoverno);

        for(PropostaDTO propostaDTO : topicoPlanoDTO.propostas()){
            PropostaPlano proposta = this.toProposta(propostaDTO, topico);
            topico.adicionarProposta(proposta);
        }
        return topico;
    }


    private PropostaPlano toProposta(PropostaDTO propostaDTO, TopicoPlano topicoPlano){
        PropostaPlano p = PropostaPlano.builder()
                .proposta(propostaDTO.proposta())
                .ideia(propostaDTO.ideia())
                .formaImplementacao(propostaDTO.formaImplementacao())
                .topicoPlano(topicoPlano).build();
        return p;
    }
}
