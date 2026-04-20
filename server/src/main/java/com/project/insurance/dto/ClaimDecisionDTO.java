package com.project.insurance.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimDecisionDTO {
    @NotNull
    private Boolean approved;
    private Double approvedAmount;
    private String remarks;
}