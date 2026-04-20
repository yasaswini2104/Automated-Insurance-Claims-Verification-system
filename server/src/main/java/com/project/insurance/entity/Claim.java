package com.project.insurance.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.project.insurance.enums.*;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Table(name = "claims")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "policy_id", nullable = false)
    private Policies policy;

    @ManyToOne
    @JoinColumn(name = "claimant_id", nullable = false)
    private User claimant;

    @Column(name = "claim_amount", nullable = false)
    private Double claimAmount;

    @Column(name = "approved_amount")
    private Double approvedAmount;

    @Column(name = "settlement_amount")
    private Double settlementAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "claim_type")
    private ClaimType claimType;

    @Enumerated(EnumType.STRING)
    private ClaimStatus status;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "incident_date")
    private LocalDate incidentDate;

    @Column(name = "filing_date")
    private LocalDate filingDate;

    @ManyToOne
    @JoinColumn(name = "assigned_adjuster_id")
    private User assignedAdjuster;

    @ManyToOne
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "settled_at")
    private LocalDateTime settledAt;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}