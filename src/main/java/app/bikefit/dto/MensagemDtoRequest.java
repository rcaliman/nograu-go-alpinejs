package app.bikefit.dto;

import java.util.UUID;

import app.bikefit.model.Mensagem;

public record MensagemDtoRequest(String mensagem, String nome, String email, UUID idResposta) {

    public static Mensagem toMensagem(MensagemDtoRequest dto) {
        var mensagem = new Mensagem();
        mensagem.setMensagem(dto.mensagem());
        mensagem.setNome(dto.nome());
        mensagem.setEmail(dto.email());
        mensagem.setIdResposta(dto.idResposta());
        return mensagem;
    }
    
}
