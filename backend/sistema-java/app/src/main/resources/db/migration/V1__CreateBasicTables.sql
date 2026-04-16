CREATE TABLE candidato(
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    partido VARCHAR(150) NOT NULL,
    cargo VARCHAR(150) NOT NULL,
    indice_de_coerencia FLOAT,
    categoria_espectro_politico VARCHAR(150)
);

CREATE TABLE plano_governo (
    id BIGSERIAL PRIMARY KEY,
    resumo TEXT,
    candidato_id BIGINT NOT NULL UNIQUE,
    CONSTRAINT fk_plano_candidato
        FOREIGN KEY (candidato_id)
        REFERENCES candidato(id)
        ON DELETE CASCADE
);

CREATE TABLE topico_plano (
    id BIGSERIAL PRIMARY KEY,
    categoria VARCHAR(150),
    resumo TEXT,
    indice_de_coerencia FLOAT,
    plano_id BIGINT NOT NULL,
    CONSTRAINT fk_topico_plano
        FOREIGN KEY (plano_id)
        REFERENCES plano_governo(id)
        ON DELETE CASCADE
);

CREATE TABLE posicionameto_publico (
    id BIGSERIAL PRIMARY KEY,
    categoria VARCHAR(150),
    data DATE,
    resumo TEXT,
    fonte VARCHAR(150),
    link VARCHAR(150),
    indice_de_coerencia FLOAT,
    candidato_id BIGINT NOT NULL UNIQUE,
    CONSTRAINT fk_posicionamento_cadidato
        FOREIGN KEY (candidato_id)
        REFERENCES candidato(id)
        ON DELETE CASCADE
);

