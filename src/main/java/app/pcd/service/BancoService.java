package app.pcd.service;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.time.LocalDateTime;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import app.pcd.model.Banco;
import app.pcd.repository.BancoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BancoService {

    private final BancoRepository bancoRepository;
    private final MessageSource messageSource;

    public LocalDateTime dataPrimeiroRegistro() {
        return bancoRepository.findFirstByOrderByCreatedAtDesc().orElseThrow(() -> new RuntimeException("Nenhum banco cadastrado")).getCreatedAt();
    }

    @Transactional
    public void apagaBancosAntigos() {
        bancoRepository.deleteAll();
    }

    @Transactional
    public void salvaBancosNovos() {

        String arquivo = "/tmp/bancos.csv";

        try (BufferedReader br = new BufferedReader(new FileReader(arquivo))) {
            String linha = br.readLine();
            while ((linha = br.readLine()) != null) {
                String[] dados = linha.split(",");
                if (dados.length == 7 && dados[2].trim().matches("\\d{3}")) {
                    Banco banco = new Banco();
                    banco.setIspb(dados[0]);
                    banco.setNomeReduzido(dados[1]);
                    banco.setNumeroCodigo(dados[2]);
                    banco.setParticipaCompe(dados[3]);
                    banco.setAcessoPrincipal(dados[4]);
                    banco.setNomeExtenso(dados[5]);
                    banco.setInicioOperacao(dados[6]);
                    bancoRepository.save(banco);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public Banco buscaBanco(String numeroCodigo) {
        return bancoRepository.findByNumeroCodigo(formataCodigo(numeroCodigo))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        messageSource.getMessage("pcd.erro.banco.naoEncontrado", null, LocaleContextHolder.getLocale())));
    }

    private String formataCodigo(String codigo) {
        if(codigo.length() == 1) {
            return "00" + codigo;
        } else if(codigo.length() == 2) {
            return "0" + codigo;
        }
        return codigo;
    }
}
