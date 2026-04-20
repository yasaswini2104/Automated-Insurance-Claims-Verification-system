package com.project.insurance.service;

import java.util.List;

import com.project.insurance.dto.response.*;

public interface PaymentService {

    TransactionResponseDTO processPayment(Long claimId);

    List<TransactionResponseDTO> getTransactionsByClaim(Long claimId);
}