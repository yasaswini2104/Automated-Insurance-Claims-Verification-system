package com.project.insurance.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FraudAlertRequestDTO {

    @NotNull
    private Long claimId;

    private String reason;
    private String indicators;
}