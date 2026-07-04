package app.bikefit.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import app.bikefit.model.Mensagem;

public record MensagemDtoResponse(UUID id, String mensagem, String nome, String email, UUID idResposta,
        LocalDateTime createdAt) {

    public static MensagemDtoResponse fromMensagem(Mensagem mensagem) {
        return new MensagemDtoResponse(
            mensagem.getId(),
            mensagem.getMensagem(),
            mensagem.getNome(),
            mensagem.getEmail(),
            mensagem.getIdResposta(),
            mensagem.getCreatedAt()
        );
    }
}
