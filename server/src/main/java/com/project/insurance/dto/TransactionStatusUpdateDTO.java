package com.project.insurance.dto;

import com.project.insurance.enums.TransactionStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionStatusUpdateDTO {

    private TransactionStatus transactionStatus;
    private String paymentReference;
}