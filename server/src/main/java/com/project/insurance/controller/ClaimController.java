package com.project.insurance.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.insurance.dto.response.*;
import com.project.insurance.dto.request.*;
import com.project.insurance.service.ClaimService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/claims")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService;

    //create claim
    @PostMapping
    public ResponseEntity<ClaimResponseDTO> createClaim(
            @Valid @RequestBody ClaimRequestDTO dto) {

        return ResponseEntity.ok(claimService.createClaim(dto));
    }

    //get claim by id
    @GetMapping("/{id}")
    public ResponseEntity<ClaimResponseDTO> getClaimById(@PathVariable Long id) {

        return ResponseEntity.ok(claimService.getClaimById(id));
    }

    //get claim by users
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ClaimResponseDTO>> getClaimsByUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(claimService.getClaimsByUser(userId));
    }
}