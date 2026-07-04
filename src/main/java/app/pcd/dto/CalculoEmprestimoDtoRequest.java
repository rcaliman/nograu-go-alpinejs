package app.pcd.dto;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import app.pcd.model.CalculoEmprestimo;

public record CalculoEmprestimoDtoRequest(
        String codigoBanco,

        @DateTimeFormat(pattern = "ddMMyyyy")
        LocalDate proximaParcela,

        @DateTimeFormat(pattern = "ddMMyyyy")
        LocalDate ultimaParcela,

        Integer quantidadeParcelas,

        Double valorParcela,

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
