CREATE TABLE proposta_plano(
    id BIGSERIAL PRIMARY KEY,
    proposta VARCHAR(150) NOT NULL,
    ideia VARCHAR(250) NOT NULL,
    forma_implementacao VARCHAR(250),
    topico_plano_id BIGINT NOT NULL,
    CONSTRAINT fk_proposta_plano
            FOREIGN KEY (topico_plano_id)
            REFERENCES topico_plano(id)
            ON DELETE CASCADE
);