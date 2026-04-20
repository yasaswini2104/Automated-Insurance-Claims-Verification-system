package com.project.insurance.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.project.insurance.dto.response.TransactionResponseDTO;
import com.project.insurance.entity.*;
import com.project.insurance.enums.*;
import com.project.insurance.repository.*;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final TransactionRepository transactionRepository;
    private final ClaimRepository claimRepository;

    //process payment for a claim
    @Override
    public TransactionResponseDTO processPayment(Long claimId) {

        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new IllegalArgumentException("Claim not found"));

        if (claim.getStatus() != ClaimStatus.APPROVED) {
            throw new IllegalArgumentException("Only APPROVED claims can be paid");
        }

        Transaction transaction = Transaction.builder()
                .claim(claim)
                .amount(claim.getApprovedAmount())
                .transactionType(TransactionType.SETTLEMENT) 
                .transactionStatus(TransactionStatus.INITIATED)
                .paymentReference(generateReference())
                .createdAt(LocalDateTime.now())
                .build();

        transactionRepository.save(transaction);

        try {
            transaction.setTransactionStatus(TransactionStatus.COMPLETED);
            //update claim
            claim.setSettlementAmount(claim.getApprovedAmount());
            claim.setStatus(ClaimStatus.SETTLED);
            claim.setSettledAt(LocalDateTime.now());

            claimRepository.save(claim);

        } catch (Exception e) {
            transaction.setTransactionStatus(TransactionStatus.FAILED);

            throw new RuntimeException("Payment failed");
        }

        transactionRepository.save(transaction);

        return mapToResponse(transaction);
    }

    //get all transactions for a claim
    @Override
    public List<TransactionResponseDTO> getTransactionsByClaim(Long claimId) {

        return transactionRepository.findByClaimId(claimId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    //generate unique payment reference
    private String generateReference() {
        return "TXN-" + UUID.randomUUID().toString().substring(0, 8);
    }

    private TransactionResponseDTO mapToResponse(Transaction tx) {

        return TransactionResponseDTO.builder()
                .id(tx.getId())
                .claimId(tx.getClaim().getId())
                .amount(tx.getAmount())
                .transactionType(tx.getTransactionType())
                .transactionStatus(tx.getTransactionStatus())
                .paymentReference(tx.getPaymentReference())
                .createdAt(tx.getCreatedAt())
                .build();
    }
}