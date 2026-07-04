package app.bikefit.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import app.bikefit.dto.FitDtoRequest;
import app.bikefit.dto.FitDtoResponse;
import app.bikefit.service.FitService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/fit")
@AllArgsConstructor
public class FitController {

    private final FitService fitService;

    @PostMapping
    public ResponseEntity<FitDtoResponse> bikefit(@Valid @RequestBody FitDtoRequest dtoRequest) {
        var fit = FitDtoRequest.toFit(dtoRequest);
        var fitResponse = fitService.calculate(fit);
        var uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(fit.getId())
                .toUri();
        return ResponseEntity.created(uri).body(fitResponse);
    }

    @GetMapping("{id}")
    public ResponseEntity<FitDtoResponse> view(@PathVariable UUID id) {
        var dtoResponse = fitService.view(id);
        return ResponseEntity.ok(dtoResponse);
    }

    @GetMapping
    public ResponseEntity<List<FitDtoResponse>> findByEmail(@RequestParam String email) {
        var dtoResponse = fitService.findByEmail(email);
        return ResponseEntity.ok(dtoResponse);
    }

    @GetMapping("qtd")
    public ResponseEntity<Long> qtdCalculos() {
        return ResponseEntity.ok(fitService.qtdCalculosHoje());
    }
}
