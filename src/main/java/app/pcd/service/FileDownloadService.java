package app.pcd.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;

import org.springframework.stereotype.Service;

@Service
public class FileDownloadService {

    private BancoService bancoService;

    FileDownloadService(BancoService bancoService) {
        this.bancoService = bancoService;
    }

    private static final String FILE_URL = "https://www.bcb.gov.br/content/estabilidadefinanceira/str1/ParticipantesSTR.csv";
    private static final Path DESTINATION = Path.of("/tmp/bancos.csv");

    private void downloadFile() throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(FILE_URL))
                .GET()
                .build();

        HttpResponse<InputStream> response = client.send(request, HttpResponse.BodyHandlers.ofInputStream());
        Files.createDirectories(DESTINATION.getParent());
        Files.copy(response.body(), DESTINATION, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
    }

    public void atualizaBancos() throws IOException, InterruptedException {

        boolean precisaAtualizar = false;

        try {
            LocalDate dataPrimeiroRegistro = bancoService.dataPrimeiroRegistro().toLocalDate();
            if (dataPrimeiroRegistro == null || !dataPrimeiroRegistro.equals(LocalDate.now())) {
                precisaAtualizar = true;
            }
        } catch (Exception e) {
            System.err.println("Erro ao consultar a data do registro, forçando atualização. " + e.getMessage());
            precisaAtualizar = true;
        }

        if (precisaAtualizar) {
            efetuarAtualizacaoCompleta();
        }

    }

    private void efetuarAtualizacaoCompleta() throws IOException, InterruptedException, FileNotFoundException {
        System.out.println("Efetuando atualização.");
        this.downloadFile();
        bancoService.apagaBancosAntigos();
        bancoService.salvaBancosNovos();
        System.out.println("Atualização completa");
    }
}
