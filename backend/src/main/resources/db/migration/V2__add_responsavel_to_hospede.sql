ALTER TABLE hospede ADD COLUMN responsavel_id BIGINT;
ALTER TABLE hospede ADD CONSTRAINT fk_hospede_responsavel FOREIGN KEY (responsavel_id) REFERENCES hospede (id);
