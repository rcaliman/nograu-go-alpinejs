package app.pcd.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tb_calculo_emprestimo")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CalculoEmprestimo {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "codigo_banco", nullable = false)
    private String codigoBanco;

    @Column(name = "proxima_parcela", nullable = false)
    private LocalDate proximaParcela;

    @Column(name = "ultima_parcela", nullable = false)
    private LocalDate ultimaParcela;

    @Column(name = "quantidade_parcelas", nullable = false)
    private Integer quantidadeParcelas;

    @Column(name = "valor_parcela", nullable = false)
    private Double valorParcela;

    @Column(name = "valor_emprestado", nullable = false)
    private Double valorEmprestado;

    @Column(name = "taxa_juros", nullable = true)
    private Double taxaJuros;

    @Column(name = "meses_em_ser", nullable = true)
    private Integer mesesEmSer;

    @Column(name = "saldo_devedor", nullable = true)
    private Double saldoDevedor;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

}
