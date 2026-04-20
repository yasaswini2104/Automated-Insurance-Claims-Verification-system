package com.project.insurance.dto;

import com.project.insurance.enums.ClaimStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimUpdateDTO {
    private ClaimStatus status;
    private Double approvedAmount;
    private Double settlementAmount;
    private Long assignedAdjusterId;
    private String remarks;
}