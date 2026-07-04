package app.bikefit.controller;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import app.bikefit.dto.MensagemDtoRequest;
import app.bikefit.dto.MensagemDtoResponse;
import app.bikefit.service.MensagemService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("mensagem")
@RequiredArgsConstructor
public class MensagemController {

    private final MensagemService mensagemService;

    @GetMapping("{id}")
    public ResponseEntity<MensagemDtoResponse> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(mensagemService.buscarMensagemPorId(id));
    }

    @PostMapping
    public ResponseEntity<Void> enviarMensagem(@RequestBody MensagemDtoRequest dtoMensagem,
            @RequestParam(required = false) UUID idResposta) {
        var mensagem = MensagemDtoRequest.toMensagem(dtoMensagem);
        mensagem.setIdResposta(idResposta);
        mensagemService.salvarMensagem(mensagem);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Page<MensagemDtoResponse>> buscarTodasMensagens(
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        return ResponseEntity.ok(mensagemService.buscarTodasAsMensagens(pageable));
    }

}
