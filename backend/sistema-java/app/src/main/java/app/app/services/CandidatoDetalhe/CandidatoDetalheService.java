package app.app.services.CandidatoDetalhe;

import app.app.DTO.CandidatoDetalhe.CandidatoDetalheDTO;
import app.app.DTO.CandidatoDetalhe.BucketResponse.PlanoGovernoDTO;
import app.app.DTO.CandidatoDetalhe.ResumoDTO;
import app.app.domain.Candidato.Candidato;
import app.app.domain.Plano.PlanoDeGoverno;
import app.app.repository.CandidatoJpaRepository;
import app.app.repository.ResumoJpaRepository;
import app.app.utils.exeptions.CandidatoNotFoundException;
import app.app.utils.exeptions.ResumoNotFoundException;
import app.app.utils.mapper.PlanoMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;


import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CandidatoDetalheService {

    @Autowired
    private S3Client s3Client;

    @Autowired
    private CandidatoJpaRepository candidatoRepository;

    @Autowired
    private ResumoJpaRepository resumoJpaRepository;

    private final ObjectMapper om;
    private final PlanoMapper planoMapper = new PlanoMapper();



    public CandidatoDetalheDTO getCandidato(Long id){
        Optional<Candidato> result = candidatoRepository.findById(id);
        Candidato candidato = result.orElseThrow(() -> new CandidatoNotFoundException("ID não foi encontrado."));
        return new CandidatoDetalheDTO(candidato.getNome(),
                candidato.getPartido(),
                candidato.getLinkFoto(),
                candidato.getCargo(),
                candidato.getIndiceDeCoerencia(),
                candidato.getEstado(),
                candidato.getCidade(),
                candidato.getCategoriaEspectroPolitico(),
                candidato.getGraficoRadar(),
                candidato.getPosicionamentoPublicoList(),
                candidato.getPlanoDeGoverno().getResumo());
    }


    public void salvarResumo(Long candidatoId, String bucketName, String bucketKey) throws JsonProcessingException {
        GetObjectRequest request = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(bucketKey)
                .build();

        ResponseBytes<GetObjectResponse> responseBytes = s3Client.getObjectAsBytes(request);
        String responseString = responseBytes.asUtf8String();
        PlanoGovernoDTO planoGovernoDTO = this.om.readValue(responseString, PlanoGovernoDTO.class);
        Candidato candidato = candidatoRepository.getReferenceById(candidatoId);

        resumoJpaRepository.save(planoMapper.toEntity(planoGovernoDTO, candidato, bucketName, bucketKey));
    }

    public ResumoDTO getResumo(Long candidatoId){
        Optional<PlanoDeGoverno> result = resumoJpaRepository.findByCandidatoId(candidatoId);
        PlanoDeGoverno resumo = result.orElseThrow(()-> new ResumoNotFoundException("Resumo do candidato de ID " + candidatoId + " não foi encontrado"));
        return new ResumoDTO(resumo.getResumo(), resumo.getTopicoPlanoList());
    }
}


// Precisa fazer a estrutura de python funcionar
// Verificar se Persistiu sem erros
// Melhorar a página front end (Nav bar na página do candidato, diminuir as infos básicas, colocar um treco de resumo)