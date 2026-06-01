CREATE SEQUENCE IF NOT EXISTS entidade_dominio_seq START WITH 1 INCREMENT BY 50;

CREATE TABLE hospede (
    id BIGINT PRIMARY KEY,
    data_cadastro TIMESTAMP,
    nome_completo VARCHAR(255),
    cpf VARCHAR(14),
    data_nascimento DATE,
    telefone VARCHAR(20),
    email VARCHAR(255),
    logradouro VARCHAR(255),
    numero VARCHAR(20),
    cep VARCHAR(20),
    bairro VARCHAR(255),
    complemento VARCHAR(255),
    cidade VARCHAR(255),
    estado VARCHAR(2),
    ativo BOOLEAN
);

CREATE TABLE usuario_funcionario (
    id BIGINT PRIMARY KEY,
    data_cadastro TIMESTAMP,
    nome_completo VARCHAR(255),
    cpf VARCHAR(14),
    data_nascimento DATE,
    telefone VARCHAR(20),
    email VARCHAR(255),
    logradouro VARCHAR(255),
    numero VARCHAR(20),
    cep VARCHAR(20),
    bairro VARCHAR(255),
    complemento VARCHAR(255),
    cidade VARCHAR(255),
    estado VARCHAR(2),
    ativo BOOLEAN
);

CREATE TABLE quarto (
    id BIGINT PRIMARY KEY,
    data_cadastro TIMESTAMP,
    ativo BOOLEAN,
    cap_adultos INTEGER,
    cap_criancas INTEGER,
    numero INTEGER,
    preco_base DECIMAL(19, 2),
    tipo_quarto VARCHAR(255)
);

CREATE TABLE politica_cancelamento (
    id BIGINT PRIMARY KEY,
    data_cadastro TIMESTAMP,
    ativo BOOLEAN,
    porcentagem FLOAT,
    estorno_valor BOOLEAN,
    horas_antes_cancelamento INTEGER
);

CREATE TABLE promocao (
    id BIGINT PRIMARY KEY,
    data_cadastro TIMESTAMP,
    ativo BOOLEAN,
    porcentagem FLOAT,
    valor_desconto DECIMAL(19, 2)
);

CREATE TABLE reserva (
    id BIGINT PRIMARY KEY,
    data_cadastro TIMESTAMP,
    no_show BOOLEAN,
    check_in TIMESTAMP,
    check_out TIMESTAMP,
    quant_adultos INTEGER,
    quant_criancas INTEGER,
    valor_total DECIMAL(19, 2),
    quarto_id BIGINT REFERENCES quarto(id),
    hospede_id BIGINT REFERENCES hospede(id),
    status VARCHAR(255),
    canal VARCHAR(255),
    politica_cancelamento_id BIGINT REFERENCES politica_cancelamento(id),
    promocao_id BIGINT REFERENCES promocao(id)
);

CREATE TABLE pagamento (
    id BIGINT PRIMARY KEY,
    data_cadastro TIMESTAMP,
    valor DECIMAL(19, 2),
    data_operacao TIMESTAMP,
    reserva_id BIGINT REFERENCES reserva(id),
    forma_pagamento VARCHAR(255),
    status_pagamento VARCHAR(255)
);

-- Mock Data
INSERT INTO quarto (id, data_cadastro, ativo, cap_adultos, cap_criancas, numero, preco_base, tipo_quarto) VALUES 
(nextval('entidade_dominio_seq'), CURRENT_TIMESTAMP, true, 2, 0, 101, 150.00, 'SINGLE'),
(nextval('entidade_dominio_seq'), CURRENT_TIMESTAMP, true, 2, 1, 102, 200.00, 'DUPLO'),
(nextval('entidade_dominio_seq'), CURRENT_TIMESTAMP, true, 4, 2, 201, 350.00, 'SUITE');

INSERT INTO politica_cancelamento (id, data_cadastro, ativo, porcentagem, estorno_valor, horas_antes_cancelamento) VALUES 
(nextval('entidade_dominio_seq'), CURRENT_TIMESTAMP, true, 10.0, true, 24),
(nextval('entidade_dominio_seq'), CURRENT_TIMESTAMP, true, 50.0, true, 48),
(nextval('entidade_dominio_seq'), CURRENT_TIMESTAMP, true, 100.0, false, 12);

INSERT INTO promocao (id, data_cadastro, ativo, porcentagem, valor_desconto) VALUES 
(nextval('entidade_dominio_seq'), CURRENT_TIMESTAMP, true, 15.0, 0),
(nextval('entidade_dominio_seq'), CURRENT_TIMESTAMP, true, 0, 50.00),
(nextval('entidade_dominio_seq'), CURRENT_TIMESTAMP, false, 20.0, 0);

INSERT INTO hospede (id, data_cadastro, nome_completo, cpf, data_nascimento, telefone, email, logradouro, numero, cep, bairro, cidade, estado, ativo) VALUES 
(nextval('entidade_dominio_seq'), CURRENT_TIMESTAMP, 'Carlos Silva', '12345678901', '1985-06-15', '11999999999', 'carlos@email.com', 'Rua A', '123', '01000000', 'Centro', 'São Paulo', 'SP', true);
