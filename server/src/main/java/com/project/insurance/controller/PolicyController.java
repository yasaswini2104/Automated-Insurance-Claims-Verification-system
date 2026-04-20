package com.project.insurance.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.insurance.dto.response.*;
import com.project.insurance.dto.request.*;
import com.project.insurance.dto.*;
import com.project.insurance.service.PolicyService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/policies")
@RequiredArgsConstructor
public class PolicyController {

    private final PolicyService policyService;

    // CREATE
    @PostMapping
    public ResponseEntity<PolicyResponseDTO> createPolicy(
            @Valid @RequestBody PolicyRequestDTO dto) {

        return ResponseEntity.ok(policyService.createPolicy(dto));
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<PolicyResponseDTO> updatePolicy(
            @PathVariable Long id,
            @RequestBody PolicyUpdateDTO dto) {

        return ResponseEntity.ok(policyService.updatePolicy(id, dto));
    }

    // STATUS UPDATE
    @PatchMapping("/{id}/status")
    public ResponseEntity<PolicyResponseDTO> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return ResponseEntity.ok(policyService.updatePolicyStatus(id, status));
    }

    // GET
    @GetMapping("/{id}")
    public ResponseEntity<PolicyResponseDTO> getPolicy(@PathVariable Long id) {

        return ResponseEntity.ok(policyService.getPolicyById(id));
    }

    // GET BY USER
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PolicyResponseDTO>> getPoliciesByUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(policyService.getPoliciesByUser(userId));
    }

    // FILTER
    @GetMapping("/status")
    public ResponseEntity<List<PolicyResponseDTO>> getByStatus(
            @RequestParam String status) {

        return ResponseEntity.ok(policyService.getPoliciesByStatus(status));
    }
}