package app.bikefit.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import app.bikefit.model.Mensagem;

public interface MensagemRepository extends JpaRepository<Mensagem, UUID> {
    Page<Mensagem> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
