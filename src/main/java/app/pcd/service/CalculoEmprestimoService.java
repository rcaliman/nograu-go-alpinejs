package app.pcd.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import app.pcd.model.CalculoEmprestimo;
import app.pcd.repository.CalculoEmprestimoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class CalculoEmprestimoService {

    private static final ZoneId ZONA_BRASIL = ZoneId.of("America/Sao_Paulo");

    private final CalculoEmprestimoRepository calculoEmprestimoRepository;
    private final CalculadoraFinanceiraService calculadoraFinanceiraService;

    public Long qtdCalculos() {
        var inicioDoDia = inicioDoDiaAtual();
        var fimDoDia = inicioDoDia.plusDays(1);
        return calculoEmprestimoRepository.countByCreatedAtBetween(inicioDoDia, fimDoDia);
    }

    @Transactional
    public CalculoEmprestimo calcular(CalculoEmprestimo calculoEmprestimo) {
        var taxaJuros = calculadoraFinanceiraService.rate(calculoEmprestimo.getQuantidadeParcelas(), calculoEmprestimo.getValorParcela(), calculoEmprestimo.getValorEmprestado());
        var mesesEmSer = calculadoraFinanceiraService.calculaMeses(calculoEmprestimo.getProximaParcela(), calculoEmprestimo.getUltimaParcela());
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

    private LocalDateTime inicioDoDiaAtual() {
        LocalDate hoje = LocalDate.now(ZONA_BRASIL);
        ZonedDateTime inicioNoBrasil = hoje.atStartOfDay(ZONA_BRASIL);
        return inicioNoBrasil.withZoneSameInstant(ZoneId.systemDefault()).toLocalDateTime();
    }

}
