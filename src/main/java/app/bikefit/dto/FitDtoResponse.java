package app.bikefit.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import app.bikefit.model.Fit;

public record FitDtoResponse(UUID id, Double cavalo, Double esterno, Double braco, String email, Double quadroSpeed, Double quadroMtb, Double alturaSelim, Double topTubeEfetivo, LocalDateTime createdAt) {

    public static FitDtoResponse dtoResponse(Fit fit) {
        return new FitDtoResponse(fit.getId(), fit.getCavalo(), fit.getEsterno(), fit.getBraco(), fit.getEmail(), fit.getQuadroSpeed(), fit.getQuadroMtb(), fit.getAlturaSelim(), fit.getTopTubeEfetivo(), fit.getCreatedAt());
    } 


}
