package app.pcd.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import app.pcd.model.CalculoEmprestimo;
import app.pcd.repository.CalculoEmprestimoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class CalculoEmprestimoService {

    private final CalculoEmprestimoRepository calculoEmprestimoRepository;
    private final CalculadoraFinanceiraService calculadoraFinanceiraService;

    public Long qtdCalculos() {
        var inicioDoDia = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
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
        var inicioDoDia = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        return calculoEmprestimoRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(inicioDoDia, inicioDoDia.plusDays(1));
    }


}
