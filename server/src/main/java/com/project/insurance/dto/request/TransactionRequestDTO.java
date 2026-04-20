package com.project.insurance.dto.request;

import com.project.insurance.enums.TransactionType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionRequestDTO {

    private Long claimId;
    private Double amount;

    private TransactionType transactionType;
}