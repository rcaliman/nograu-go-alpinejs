package app.bikefit.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import app.bikefit.dto.MensagemDtoResponse;
import app.bikefit.model.Mensagem;
import app.bikefit.repository.MensagemRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MensagemService {

    private final MensagemRepository mensagemRepository;
    private final Optional<EmailService> emailService;

    public Mensagem salvarMensagem(Mensagem mensagem) {
        if (mensagem.getIdResposta() != null) {
            emailService.ifPresent(service ->
                mensagemRepository.findById(mensagem.getIdResposta()).ifPresent(original ->
                    service.enviarEmail(original.getEmail(), "Sua mensagem recebeu uma resposta!",
                        "Olá, " + original.getNome() + "! Sua mensagem no mural do nograu.com.br recebeu uma resposta de " + mensagem.getNome() + ".")
                )
            );
        }
        return mensagemRepository.save(mensagem);
    }

    public MensagemDtoResponse buscarMensagemPorId(UUID id) {
        return mensagemRepository.findById(id)
            .map(mensagem -> MensagemDtoResponse.fromMensagem(mensagem))
            .orElseThrow(() -> new RuntimeException("Mensagem não encontrada"));
    }

    public Page<MensagemDtoResponse> buscarTodasAsMensagens(Pageable pageable) {
        return mensagemRepository.findAllByOrderByCreatedAtDesc(pageable).map(MensagemDtoResponse::fromMensagem);
    }
}
