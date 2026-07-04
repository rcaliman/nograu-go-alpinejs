package app.pcd.model;

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
import lombok.Setter;

@Table(name = "tb_banco")
@Entity
@Getter
@Setter
public class Banco {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "ispb", nullable = false, unique = true)
    private String ispb;

    @Column(name = "nome_reduzido", nullable = false, unique = false)
    private String nomeReduzido;

    @Column(name = "numero_codigo", nullable = false, unique = true)
    private String numeroCodigo;

    @Column(name = "participa_compe", nullable = true, unique = false)
    private String participaCompe;

    @Column(name = "acesso_principal", nullable = true, unique = false)
    private String acessoPrincipal;

    @Column(name = "nome_extenso", nullable = false, unique = false)
    private String nomeExtenso;

    @Column(name = "inicio_operacao", nullable = false, unique = false)
    private String inicioOperacao;

    @Column(name = "created_at", nullable = false, unique = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

}
