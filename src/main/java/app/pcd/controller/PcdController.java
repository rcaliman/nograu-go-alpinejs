package app.pcd.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import app.pcd.dto.CalculoEmprestimoDtoRequest;
import app.pcd.dto.CalculoEmprestimoDtoResponse;
import app.pcd.model.Banco;
import app.pcd.service.BancoService;
import app.pcd.service.CalculoEmprestimoService;
import app.pcd.service.FileDownloadService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("pcd")
@RequiredArgsConstructor
public class PcdController {

    private final FileDownloadService fileDownloadService;
    private final BancoService bancoService;
    private final CalculoEmprestimoService calculoEmprestimoService;

    @GetMapping("banco/{numeroCodigo}")
    public ResponseEntity<Banco> find(@PathVariable String numeroCodigo) throws IOException, InterruptedException {
        fileDownloadService.atualizaBancos();
        return ResponseEntity.ok(bancoService.buscaBanco(numeroCodigo));
    }

    @PostMapping("calculo")
    public ResponseEntity<CalculoEmprestimoDtoResponse> calcular(@RequestBody CalculoEmprestimoDtoRequest request) {
        var calculo = calculoEmprestimoService.calcular(request.toModel());
        return ResponseEntity.ok(CalculoEmprestimoDtoResponse.from(calculo));
    }

    @GetMapping("calculos-dia")
    public ResponseEntity<List<CalculoEmprestimoDtoResponse>> listar() {
        return ResponseEntity.ok(calculoEmprestimoService.listarDoDia().stream().map(CalculoEmprestimoDtoResponse::from).toList());
    }

    @GetMapping("qtd-calculos")
    public ResponseEntity<Long> qtd() {
        return ResponseEntity.ok(calculoEmprestimoService.qtdCalculos());
    }

}

