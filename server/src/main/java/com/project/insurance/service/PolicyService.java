package com.project.insurance.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.project.insurance.dto.request.*;
import com.project.insurance.dto.response.*;
import com.project.insurance.dto.*;
import com.project.insurance.entity.*;
import com.project.insurance.enums.PolicyStatus;
import com.project.insurance.repository.*;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PolicyService {

    private final PolicyRepository policyRepository;
    private final UserRepository userRepository;

    // ================= CREATE =================
    public PolicyResponseDTO createPolicy(PolicyRequestDTO dto) {

        User user = userRepository.findById(dto.getPolicyHolderId())
                .orElseThrow(() -> new IllegalArgumentException("Policy holder not found"));

        validateDates(dto.getStartDate(), dto.getEndDate());

        if (dto.getEndDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("End date must be in future");
        }

        Policies policy = Policies.builder()
                .policyHolder(user)
                .coverageAmount(dto.getCoverageAmount())
                .premiumAmount(dto.getPremiumAmount())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .status(PolicyStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .build();

        policyRepository.save(policy);

        return mapToResponse(policy);
    }

    // ================= UPDATE =================
    public PolicyResponseDTO updatePolicy(Long id, PolicyUpdateDTO dto) {

        Policies policy = policyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Policy not found"));

        if (policy.getStatus() != PolicyStatus.ACTIVE) {
            throw new IllegalArgumentException("Only ACTIVE policies can be updated");
        }

        if (dto.getCoverageAmount() != null) {
            policy.setCoverageAmount(dto.getCoverageAmount());
        }

        if (dto.getPremiumAmount() != null) {
            policy.setPremiumAmount(dto.getPremiumAmount());
        }

        if (dto.getStartDate() != null && dto.getEndDate() != null) {
            validateDates(dto.getStartDate(), dto.getEndDate());
            policy.setStartDate(dto.getStartDate());
            policy.setEndDate(dto.getEndDate());
        }

        policy.setUpdatedAt(LocalDateTime.now());

        policyRepository.save(policy);

        return mapToResponse(policy);
    }

    // ================= STATUS MANAGEMENT =================
    public PolicyResponseDTO updatePolicyStatus(Long id, String status) {

        Policies policy = policyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Policy not found"));

        PolicyStatus newStatus = parseStatus(status);

        policy.setStatus(newStatus);
        policy.setUpdatedAt(LocalDateTime.now());

        policyRepository.save(policy);

        return mapToResponse(policy);
    }

    // ================= AUTO EXPIRE =================
    public void autoExpirePolicies() {

        List<Policies> policies = policyRepository.findAll();

        for (Policies policy : policies) {
            if (policy.getEndDate().isBefore(LocalDate.now())
                    && policy.getStatus() == PolicyStatus.ACTIVE) {

                policy.setStatus(PolicyStatus.EXPIRED);
            }
        }

        policyRepository.saveAll(policies);
    }

    // ================= GET =================
    public PolicyResponseDTO getPolicyById(Long id) {

        return policyRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new IllegalArgumentException("Policy not found"));
    }

    public List<PolicyResponseDTO> getPoliciesByUser(Long userId) {

        return policyRepository.findByPolicyHolderId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<PolicyResponseDTO> getPoliciesByStatus(String status) {

        PolicyStatus statusEnum = parseStatus(status);

        return policyRepository.findAll()
                .stream()
                .filter(p -> p.getStatus() == statusEnum)
                .map(this::mapToResponse)
                .toList();
    }

    // ================= HELPERS =================

    private void validateDates(LocalDate start, LocalDate end) {
        if (start.isAfter(end)) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }
    }

    private PolicyStatus parseStatus(String status) {

        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Status must not be empty");
        }

        try {
            return PolicyStatus.valueOf(status.trim().toUpperCase());
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid policy status: " + status);
        }
    }

    private PolicyResponseDTO mapToResponse(Policies policy) {

        return PolicyResponseDTO.builder()
                .id(policy.getId())
                .policyHolderId(policy.getPolicyHolder().getId())
                .coverageAmount(policy.getCoverageAmount())
                .premiumAmount(policy.getPremiumAmount())
                .startDate(policy.getStartDate())
                .endDate(policy.getEndDate())
                .status(policy.getStatus())
                .createdAt(policy.getCreatedAt())
                .build();
    }
}