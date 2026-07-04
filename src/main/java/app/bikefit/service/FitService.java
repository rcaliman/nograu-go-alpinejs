package app.bikefit.service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import app.bikefit.dto.FitDtoResponse;
import app.bikefit.model.Fit;
import app.bikefit.repository.FitRepository;
import app.bikefit.util.FitCalc;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FitService {

    private final FitRepository fitRepository;

    @Transactional
    public FitDtoResponse calculate(Fit fit) {
        fit.setQuadroSpeed(FitCalc.quadroSpeed(fit.getCavalo()));
        fit.setQuadroMtb(FitCalc.quadroMtb(fit.getCavalo()));
        fit.setAlturaSelim(FitCalc.alturaSelim(fit.getCavalo()));
        fit.setTopTubeEfetivo(FitCalc.topTubeEfetivo(fit.getCavalo(), fit.getEsterno(), fit.getBraco()));
        return FitDtoResponse.dtoResponse(fitRepository.saveAndFlush(fit));
    }

    public FitDtoResponse view(UUID id) {
        Optional<Fit> fit = fitRepository.findById(id);
        return fit.map(FitDtoResponse::dtoResponse).orElseThrow(() -> new RuntimeException("Fit não encontrado"));
    }

    public List<FitDtoResponse> findByEmail(@RequestParam String email) {
        var fits = fitRepository.findAllByEmailOrderByCreatedAtDesc(email).orElseThrow(() -> new RuntimeException("Fit não encontrado"));
        return fits.stream().map(FitDtoResponse::dtoResponse).toList();
    }

    public long qtdCalculosHoje() {
        return fitRepository.countByCreatedAtBetween(LocalDateTime.now().with(LocalTime.MIN), LocalDateTime.now().with(LocalTime.MAX));
    }
}
