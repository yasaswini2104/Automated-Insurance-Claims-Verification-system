package com.project.insurance.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PolicyRequestDTO {

    @NotNull(message = "Policy holder ID is required")
    private Long policyHolderId;

    @NotNull(message = "Coverage amount is required")
    @Positive(message = "Coverage must be positive")
    private Double coverageAmount;

    @NotNull(message = "Premium amount is required")
    @Positive(message = "Premium must be positive")
    private Double premiumAmount;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;
}