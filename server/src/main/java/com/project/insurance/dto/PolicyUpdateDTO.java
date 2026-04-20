package com.project.insurance.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PolicyUpdateDTO {

    @Positive(message = "Coverage must be positive")
    private Double coverageAmount;

    @Positive(message = "Premium must be positive")
    private Double premiumAmount;

    private LocalDate startDate;
    private LocalDate endDate;
}