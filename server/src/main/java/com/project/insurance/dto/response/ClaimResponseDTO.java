package com.project.insurance.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.project.insurance.enums.*;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimResponseDTO {
    private Long id;
    private Long policyId;
    private Long claimantId;
    private Double claimAmount;
    private Double approvedAmount;
    private Double settlementAmount;
    private ClaimType claimType;
    private ClaimStatus status;
    private String description;
    private LocalDate incidentDate;
    private LocalDate filingDate;
    private LocalDateTime createdAt;
}