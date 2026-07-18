package app.pcd.dto;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import app.pcd.model.CalculoEmprestimo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CalculoEmprestimoDtoRequest(
        @NotBlank
        String codigoBanco,

        @NotNull
        @DateTimeFormat(pattern = "ddMMyyyy")
        LocalDate proximaParcela,

        @NotNull
        @DateTimeFormat(pattern = "ddMMyyyy")
        LocalDate ultimaParcela,

        @NotNull @Positive
        Integer quantidadeParcelas,

        @NotNull @Positive
        Double valorParcela,

        @NotNull @Positive
        Double valorEmprestado
) {

    public CalculoEmprestimo toModel() {
        var model = new CalculoEmprestimo();
        model.setCodigoBanco(this.codigoBanco);
        model.setProximaParcela(this.proximaParcela);
        model.setUltimaParcela(this.ultimaParcela);
        model.setQuantidadeParcelas(this.quantidadeParcelas);
        model.setValorParcela(this.valorParcela/100);
        model.setValorEmprestado(this.valorEmprestado/100);
        return model;
    }
    
}
