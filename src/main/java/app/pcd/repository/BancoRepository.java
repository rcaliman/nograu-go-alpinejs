package app.pcd.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import app.pcd.model.Banco;

public interface BancoRepository extends JpaRepository<Banco, UUID> {

    Optional<Banco> findByNumeroCodigo(String numeroCodigo);

    Optional<Banco> findFirstByOrderByCreatedAtDesc();

}
