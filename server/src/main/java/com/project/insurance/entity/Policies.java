package com.project.insurance.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.project.insurance.enums.PolicyStatus;
import com.project.insurance.enums.PolicyType;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "policies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Policies {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "policy_number", unique = true, nullable = false)
    private String policyNumber;

    @ManyToOne
    @JoinColumn(name = "policyholder_id", nullable = false)
    private User policyHolder;

    @Enumerated(EnumType.STRING)
    @Column(name = "policy_type")
    private PolicyType policyType;

    private Double coverageAmount;
    private Double premiumAmount;

    private LocalDate startDate;
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    private PolicyStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}