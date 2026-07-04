package app.pcd.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import app.pcd.model.CalculoEmprestimo;

public interface CalculoEmprestimoRepository extends JpaRepository<CalculoEmprestimo, UUID> {

    Long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    List<CalculoEmprestimo> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime inicioDoDia, LocalDateTime fimDoDia);
}
