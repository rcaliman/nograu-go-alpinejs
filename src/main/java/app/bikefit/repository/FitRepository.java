package app.bikefit.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import app.bikefit.model.Fit;

public interface FitRepository extends JpaRepository<Fit, UUID> {
    Optional<List<Fit>> findAllByEmailOrderByCreatedAtDesc(String email);

    long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
}
