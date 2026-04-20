package com.project.insurance.dto.response;

import java.time.LocalDateTime;

import com.project.insurance.enums.TransactionStatus;
import com.project.insurance.enums.TransactionType;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionResponseDTO {

    private Long id;
    private Long claimId;

    private Double amount;

    private TransactionType transactionType;
    private TransactionStatus transactionStatus;

    private String paymentReference;

    private LocalDateTime createdAt;
}