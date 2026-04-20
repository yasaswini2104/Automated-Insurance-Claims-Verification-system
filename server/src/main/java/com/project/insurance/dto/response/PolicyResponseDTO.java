package com.project.insurance.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.project.insurance.enums.PolicyStatus;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PolicyResponseDTO {

    private Long id;
    private Long policyHolderId;
    private Double coverageAmount;
    private Double premiumAmount;
    private LocalDate startDate;
    private LocalDate endDate;
    private PolicyStatus status;
    private LocalDateTime createdAt;
}