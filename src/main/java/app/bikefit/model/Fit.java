package app.bikefit.model;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "tb_bikefit")
@NoArgsConstructor
public class Fit {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "cavalo", nullable = false)
    private Double cavalo;

    @Column(name = "esterno", nullable = false)
    private Double esterno;
    
    @Column(name = "braco", nullable = false)
    private Double braco;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "quadro_speed", nullable = true)
    private Double quadroSpeed;

    @Column(name = "quadro_mtb", nullable = true)
    private Double quadroMtb;

    @Column(name = "altura_selim", nullable = true)
    private Double alturaSelim;

    @Column(name = "top_tube_efetivo", nullable = true)
    private Double topTubeEfetivo;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;
    
}
