package com.project.insurance.dto.response;

import java.time.LocalDateTime;

import com.project.insurance.enums.FraudStatus;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FraudAlertResponseDTO {

    private Long id;
    private Long claimId;

    private Integer fraudScore;

    private String reason;
    private String indicators;

    private FraudStatus status;

    private Long analystId;

    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}