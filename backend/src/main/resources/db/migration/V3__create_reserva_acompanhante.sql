CREATE TABLE reserva_acompanhante (
    reserva_id BIGINT REFERENCES reserva(id),
    hospede_id BIGINT REFERENCES hospede(id),
    PRIMARY KEY (reserva_id, hospede_id)
);
