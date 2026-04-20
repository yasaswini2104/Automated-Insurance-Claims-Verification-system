package com.project.insurance.dto;

import com.project.insurance.enums.FraudStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FraudResolutionDTO {

    private FraudStatus status;   // CONFIRMED / RESOLVED
    private Long resolvedById;
    private String resolutionRemark;
}