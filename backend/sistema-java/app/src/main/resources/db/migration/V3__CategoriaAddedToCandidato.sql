CREATE TABLE categoria_classificaion(
    id           BIGSERIAL PRIMARY KEY,
    candidato_id BIGINT NOT NULL,
    categoria    VARCHAR(100),
    percentual   FLOAT,
    CONSTRAINT fk_categoria_classification
        FOREIGN KEY (candidato_id)
            REFERENCES candidato (id)
            ON DELETE CASCADE
);