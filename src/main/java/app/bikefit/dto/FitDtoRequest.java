package app.bikefit.dto;

import app.bikefit.model.Fit;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;


public record FitDtoRequest(
    @NotNull @DecimalMin("60.0") @DecimalMax("115.0") Double cavalo,
    @NotNull @DecimalMin("45.0") @DecimalMax("165.0") Double esterno,
    @NotNull @DecimalMin("40.0") @DecimalMax("100.0") Double braco,
    @NotBlank @Email String email
) {

    public static Fit toFit(FitDtoRequest dto) {
        var fit = new Fit();
        fit.setCavalo(dto.cavalo());
        fit.setEsterno(dto.esterno());
        fit.setBraco(dto.braco());
        fit.setEmail(dto.email());
        return fit;
    }
    
}
