package com.project.insurance.entity;

import java.time.LocalDateTime;

import com.project.insurance.enums.FraudStatus;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "fraud_alerts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FraudAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "claim_id", nullable = false)
    private Claim claim;

    @ManyToOne
    @JoinColumn(name = "analyst_id")
    private User analyst;

    private Integer fraudScore;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(columnDefinition = "TEXT")
    private String indicators;

    @Enumerated(EnumType.STRING)
    private FraudStatus status;

    @ManyToOne
    @JoinColumn(name = "resolved_by")
    private User resolvedBy;

    @Column(columnDefinition = "TEXT")
    private String resolutionRemark;

    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}