package com.project.insurance.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.project.insurance.dto.*;
import com.project.insurance.dto.request.*;
import com.project.insurance.dto.response.*;
import com.project.insurance.entity.*;
import com.project.insurance.enums.*;
import com.project.insurance.repository.*;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final PolicyRepository policyRepository;
    private final UserRepository userRepository;
    private final ClaimHistoryRepository historyRepository;

    //create claim
    public ClaimResponseDTO createClaim(ClaimRequestDTO dto) {

        Policies policy = getPolicy(dto.getPolicyId());
        User user = getUser(dto.getClaimantId());

        validateClaim(dto, policy);

        Claim claim = Claim.builder()
                .policy(policy)
                .claimant(user)
                .claimAmount(dto.getClaimAmount())
                .claimType(dto.getClaimType())
                .description(dto.getDescription())
                .incidentDate(dto.getIncidentDate())
                .filingDate(LocalDate.now())
                .status(ClaimStatus.SUBMITTED)
                .createdAt(LocalDateTime.now())
                .build();

        claimRepository.save(claim);

        logHistory(claim, null, ClaimStatus.SUBMITTED, user);

        return mapToResponse(claim);
    }

    //document verification
    public ClaimResponseDTO moveToDocumentVerification(Long claimId) {

        Claim claim = getClaim(claimId);

        validateState(claim, ClaimStatus.SUBMITTED);

        claim.setStatus(ClaimStatus.DOCUMENT_VERIFICATION);

        logHistory(claim, ClaimStatus.SUBMITTED,
                ClaimStatus.DOCUMENT_VERIFICATION, null);

        return mapToResponse(claimRepository.save(claim));
    }

    //start review
    public ClaimResponseDTO startReview(Long claimId, Long adjusterId) {

        Claim claim = getClaim(claimId);

        validateState(claim, ClaimStatus.DOCUMENT_VERIFICATION);

        claim.setAssignedAdjuster(getUser(adjusterId));
        claim.setStatus(ClaimStatus.UNDER_REVIEW);

        logHistory(claim, ClaimStatus.DOCUMENT_VERIFICATION,
                ClaimStatus.UNDER_REVIEW, getUser(adjusterId));

        return mapToResponse(claimRepository.save(claim));
    }

    //auto validation
    public ClaimResponseDTO autoValidate(Long claimId) {

        Claim claim = getClaim(claimId);

        validateState(claim, ClaimStatus.UNDER_REVIEW);

        claim.setStatus(ClaimStatus.AUTO_VALIDATED);

        logHistory(claim, ClaimStatus.UNDER_REVIEW, ClaimStatus.AUTO_VALIDATED, null);

        return mapToResponse(claimRepository.save(claim));
    }

    //adjuster decision
    public ClaimResponseDTO adjusterDecision(Long claimId, ClaimDecisionDTO dto, Long adjusterId) {

        Claim claim = getClaim(claimId);

        validateState(claim, ClaimStatus.AUTO_VALIDATED);

        if (!dto.getApproved()) {
            claim.setStatus(ClaimStatus.REJECTED);
        } else {
            claim.setApprovedAmount(dto.getApprovedAmount());
            claim.setStatus(ClaimStatus.ADJUSTER_APPROVED);
        }

        claim.setRemarks(dto.getRemarks());

        logHistory(claim, ClaimStatus.AUTO_VALIDATED,
                claim.getStatus(), getUser(adjusterId));

        return mapToResponse(claimRepository.save(claim));
    }

    //manager approval
    public ClaimResponseDTO managerApproval(Long claimId, boolean approved, Long managerId) {

        Claim claim = getClaim(claimId);

        validateState(claim, ClaimStatus.ADJUSTER_APPROVED);

        if (!approved) {
            claim.setStatus(ClaimStatus.REJECTED);
        } else {
            claim.setApprovedBy(getUser(managerId));
            claim.setApprovedAt(LocalDateTime.now());
            claim.setStatus(ClaimStatus.MANAGER_APPROVED);
        }

        logHistory(claim, ClaimStatus.ADJUSTER_APPROVED, claim.getStatus(), getUser(managerId));

        return mapToResponse(claimRepository.save(claim));
    }

    //final approval
    public ClaimResponseDTO finalApproval(Long claimId) {
        Claim claim = getClaim(claimId);
        validateState(claim, ClaimStatus.MANAGER_APPROVED);
        claim.setStatus(ClaimStatus.APPROVED);
        logHistory(claim, ClaimStatus.MANAGER_APPROVED, ClaimStatus.APPROVED, null);
        return mapToResponse(claimRepository.save(claim));
    }

    //settlement
    public ClaimResponseDTO settleClaim(Long claimId) {
        Claim claim = getClaim(claimId);
        validateState(claim, ClaimStatus.APPROVED);
        claim.setSettlementAmount(claim.getApprovedAmount());
        claim.setSettledAt(LocalDateTime.now());
        claim.setStatus(ClaimStatus.SETTLED);
        logHistory(claim, ClaimStatus.APPROVED, ClaimStatus.SETTLED, null);
        return mapToResponse(claimRepository.save(claim));
    }

    //get claims
    public ClaimResponseDTO getClaimById(Long id) {
        return mapToResponse(getClaim(id));
    }

    public List<ClaimResponseDTO> getClaimsByUser(Long userId) {
        return claimRepository.findByClaimantId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    //validate claims
    private void validateClaim(ClaimRequestDTO dto, Policies policy) {
        if (!policy.getStatus().equals(PolicyStatus.ACTIVE)) {
            throw new IllegalArgumentException("Policy is not active");
        }

        if (dto.getClaimAmount() > policy.getCoverageAmount()) {
            throw new IllegalArgumentException("Claim exceeds coverage amount");
        }

        if (dto.getIncidentDate().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Incident date cannot be in future");
        }

        if (dto.getIncidentDate().isBefore(policy.getStartDate()) ||
            dto.getIncidentDate().isAfter(policy.getEndDate())) {

            throw new IllegalArgumentException("Incident date outside policy period");
        }
    }

    private void validateState(Claim claim, ClaimStatus expected) {
        if (claim.getStatus() != expected) {
            throw new IllegalArgumentException(
                    "Invalid state transition. Expected: " + expected +
                    ", Found: " + claim.getStatus()
            );
        }
    }

    private Claim getClaim(Long id) {
        return claimRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Claim not found"));
    }

    private Policies getPolicy(Long id) {
        return policyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Policy not found"));
    }

    private User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private void logHistory(Claim claim,
                            ClaimStatus oldStatus,
                            ClaimStatus newStatus,
                            User user) {

        ClaimHistory history = ClaimHistory.builder()
                .claim(claim)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .changedBy(user)
                .changedAt(LocalDateTime.now())
                .build();

        historyRepository.save(history);
    }

    //mapping
    private ClaimResponseDTO mapToResponse(Claim claim) {

        return ClaimResponseDTO.builder()
                .id(claim.getId())
                .policyId(claim.getPolicy().getId())
                .claimantId(claim.getClaimant().getId())
                .claimAmount(claim.getClaimAmount())
                .approvedAmount(claim.getApprovedAmount())
                .settlementAmount(claim.getSettlementAmount())
                .claimType(claim.getClaimType())
                .status(claim.getStatus())
                .description(claim.getDescription())
                .incidentDate(claim.getIncidentDate())
                .filingDate(claim.getFilingDate())
                .createdAt(claim.getCreatedAt())
                .build();
    }
}