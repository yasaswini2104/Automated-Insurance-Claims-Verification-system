package com.project.insurance.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.project.insurance.dto.response.*;
import com.project.insurance.entity.*;
import com.project.insurance.enums.*;
import com.project.insurance.repository.*;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FraudServiceImpl implements FraudService {

    private final FraudAlertRepository fraudRepository;
    private final ClaimRepository claimRepository;

    
    @Override
    public FraudAlertResponseDTO analyzeClaim(Long claimId) {

        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new IllegalArgumentException("Claim not found"));

        int score = calculateFraudScore(claim);

        FraudAlert alert = FraudAlert.builder()
                .claim(claim)
                .fraudScore(score)
                .reason("Auto-detected")
                .status(FraudStatus.PENDING) // initial state
                .createdAt(LocalDateTime.now())
                .build();

        fraudRepository.save(alert);

        return mapToResponse(alert);
    }

    public FraudAlertResponseDTO startInvestigation(Long alertId) {

        FraudAlert alert = fraudRepository.findById(alertId)
                .orElseThrow(() -> new IllegalArgumentException("Fraud alert not found"));

        if (alert.getStatus() != FraudStatus.PENDING) {
            throw new IllegalArgumentException("Only PENDING alerts can be investigated");
        }

        alert.setStatus(FraudStatus.INVESTIGATING);

        fraudRepository.save(alert);

        return mapToResponse(alert);
    }

    
    @Override
    public FraudAlertResponseDTO markFraud(Long alertId, boolean fraud) {

        FraudAlert alert = fraudRepository.findById(alertId)
                .orElseThrow(() -> new IllegalArgumentException("Fraud alert not found"));

        if (alert.getStatus() != FraudStatus.INVESTIGATING) {
            throw new IllegalArgumentException("Fraud must be under investigation first");
        }

        alert.setStatus(
                fraud ? FraudStatus.CONFIRMED_FRAUD
                      : FraudStatus.FALSE_ALARM
        );

        alert.setResolvedAt(LocalDateTime.now());

        fraudRepository.save(alert);

        return mapToResponse(alert);
    }

    
    @Override
    public List<FraudAlertResponseDTO> getFraudsByClaim(Long claimId) {

        return fraudRepository.findByClaimId(claimId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    
    private int calculateFraudScore(Claim claim) {

        int score = 0;

        if (claim.getClaimAmount() > 100000) score += 50;

        if (claim.getClaimType() == ClaimType.ACCIDENT) score += 20;

        if (claim.getDescription() != null &&
            claim.getDescription().toLowerCase().contains("urgent")) {
            score += 10;
        }

        return score;
    }

    
    private FraudAlertResponseDTO mapToResponse(FraudAlert alert) {

        return FraudAlertResponseDTO.builder()
                .id(alert.getId())
                .claimId(alert.getClaim().getId())
                .fraudScore(alert.getFraudScore())
                .reason(alert.getReason())
                .indicators(alert.getIndicators())
                .status(alert.getStatus())
                .analystId(alert.getAnalyst() != null ? alert.getAnalyst().getId() : null)
                .createdAt(alert.getCreatedAt())
                .resolvedAt(alert.getResolvedAt())
                .build();
    }
}