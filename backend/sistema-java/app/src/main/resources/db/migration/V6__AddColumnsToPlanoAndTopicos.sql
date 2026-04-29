ALTER TABLE plano_governo
    ADD COLUMN bucket_name VARCHAR(100),
    ADD COLUMN bucket_key VARCHAR(250);

ALTER TABLE topico_plano
    ADD COLUMN quantidade_propostas INTEGER;