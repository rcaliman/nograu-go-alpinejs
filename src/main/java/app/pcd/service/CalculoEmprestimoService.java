package app.pcd.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import app.pcd.model.CalculoEmprestimo;
import app.pcd.repository.CalculoEmprestimoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class CalculoEmprestimoService {

    private static final ZoneId ZONA_BRASIL = ZoneId.of("America/Sao_Paulo");
    private static final double TAXA_MENSAL_MAXIMA = 0.15;

    private final CalculoEmprestimoRepository calculoEmprestimoRepository;
    private final CalculadoraFinanceiraService calculadoraFinanceiraService;
    private final MessageSource messageSource;

    public Long qtdCalculos() {
        var inicioDoDia = inicioDoDiaAtual();
        var fimDoDia = inicioDoDia.plusDays(1);
        return calculoEmprestimoRepository.countByCreatedAtBetween(inicioDoDia, fimDoDia);
    }

    @Transactional
    public CalculoEmprestimo calcular(CalculoEmprestimo calculoEmprestimo) {
        validarDatas(calculoEmprestimo);
        validarValorEmprestado(calculoEmprestimo);

        var mesesEmSer = calculadoraFinanceiraService.calculaMeses(calculoEmprestimo.getProximaParcela(), calculoEmprestimo.getUltimaParcela());
        validarMesesEmSer(mesesEmSer, calculoEmprestimo.getQuantidadeParcelas());

        var taxaJuros = calculadoraFinanceiraService.rate(calculoEmprestimo.getQuantidadeParcelas(), calculoEmprestimo.getValorParcela(), calculoEmprestimo.getValorEmprestado());
        validarTaxaJuros(taxaJuros);

        var saldoDevedor = calculadoraFinanceiraService.pv(taxaJuros, mesesEmSer, calculoEmprestimo.getValorParcela());

        calculoEmprestimo.setTaxaJuros(taxaJuros);
        calculoEmprestimo.setMesesEmSer(mesesEmSer);
        calculoEmprestimo.setSaldoDevedor(saldoDevedor);
        return calculoEmprestimoRepository.save(calculoEmprestimo);
    }

    public List<CalculoEmprestimo> listarDoDia() {
        var inicioDoDia = inicioDoDiaAtual();
        return calculoEmprestimoRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(inicioDoDia, inicioDoDia.plusDays(1));
    }

    private void validarDatas(CalculoEmprestimo calculo) {
        if (calculo.getUltimaParcela().isBefore(calculo.getProximaParcela())) {
            throw erro("pcd.erro.datas");
        }
    }

    private void validarValorEmprestado(CalculoEmprestimo calculo) {
        var totalDasParcelas = calculo.getValorParcela() * calculo.getQuantidadeParcelas();
        if (calculo.getValorEmprestado() > totalDasParcelas) {
            throw erro("pcd.erro.valorEmprestadoMaiorQueTotal");
        }
    }

    private void validarMesesEmSer(int mesesEmSer, int quantidadeParcelas) {
        if (mesesEmSer > quantidadeParcelas) {
            throw erro("pcd.erro.mesesEmSerMaiorQueParcelas");
        }
    }

    private void validarTaxaJuros(double taxaJuros) {
        if (taxaJuros < 0 || taxaJuros > TAXA_MENSAL_MAXIMA) {
            throw erro("pcd.erro.taxaImplausivel");
        }
    }

    private ResponseStatusException erro(String codigo) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST,
                messageSource.getMessage(codigo, null, LocaleContextHolder.getLocale()));
    }

    private LocalDateTime inicioDoDiaAtual() {
        LocalDate hoje = LocalDate.now(ZONA_BRASIL);
        ZonedDateTime inicioNoBrasil = hoje.atStartOfDay(ZONA_BRASIL);
        return inicioNoBrasil.withZoneSameInstant(ZoneId.systemDefault()).toLocalDateTime();
    }

}
