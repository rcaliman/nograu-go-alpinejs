package app.pcd.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.format.annotation.DateTimeFormat;

import app.pcd.model.CalculoEmprestimo;

public record CalculoEmprestimoDtoResponse(
        UUID id,
        String codigoBanco,

        @DateTimeFormat(pattern = "ddMMyyyy")
        LocalDate proximaParcela,

        @DateTimeFormat(pattern = "ddMMyyyy")
        LocalDate ultimaParcela,

        Integer quantidadeParcelas,

        Double valorParcela,

        Double valorEmprestado,

        Double taxaJuros,

        Integer mesesEmSer,

        Double saldoDevedor,

        LocalDateTime createdAt
) {
    
    public static CalculoEmprestimoDtoResponse from(CalculoEmprestimo model) {
        return new CalculoEmprestimoDtoResponse(
                model.getId(),
                model.getCodigoBanco(),
                model.getProximaParcela(),
                model.getUltimaParcela(),
                model.getQuantidadeParcelas(),
                model.getValorParcela(),
                model.getValorEmprestado(),
                model.getTaxaJuros() * 100,
                model.getMesesEmSer(),
                model.getSaldoDevedor() * -1,
                model.getCreatedAt());
    }
}
