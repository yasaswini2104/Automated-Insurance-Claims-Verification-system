package com.project.insurance.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.insurance.dto.response.*;
import com.project.insurance.service.FraudService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/fraud")
@RequiredArgsConstructor
public class FraudController {

    private final FraudService fraudService;

    // Analyze claim for fraud
    @PostMapping("/analyze/{claimId}")
    public ResponseEntity<FraudAlertResponseDTO> analyzeClaim(
            @PathVariable Long claimId) {

        return ResponseEntity.ok(fraudService.analyzeClaim(claimId));
    }

    // mark as fraud or not
    @PutMapping("/{alertId}")
    public ResponseEntity<FraudAlertResponseDTO> markFraud(
            @PathVariable Long alertId,
            @RequestParam boolean fraud) {

        return ResponseEntity.ok(fraudService.markFraud(alertId, fraud));
    }

    // get fraud alerts for a claim
    @GetMapping("/claim/{claimId}")
    public ResponseEntity<List<FraudAlertResponseDTO>> getFraudsByClaim(
            @PathVariable Long claimId) {

        return ResponseEntity.ok(fraudService.getFraudsByClaim(claimId));
    }
}