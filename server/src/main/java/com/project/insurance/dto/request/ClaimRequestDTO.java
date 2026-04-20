package com.project.insurance.dto.request;

import java.time.LocalDate;

import com.project.insurance.enums.ClaimType;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimRequestDTO {

    @NotNull(message = "Policy ID is required")
    private Long policyId;

    @NotNull(message = "Claimant ID is required")
    private Long claimantId;

    @NotNull(message = "Claim amount is required")
    @Positive(message = "Claim amount must be positive")
    private Double claimAmount;

    @NotNull(message = "Claim type is required")
    private ClaimType claimType;

    private String description;

    @NotNull(message = "Incident date is required")
    private LocalDate incidentDate;
}