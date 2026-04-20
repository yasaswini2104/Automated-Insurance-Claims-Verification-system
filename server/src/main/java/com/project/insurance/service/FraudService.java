package com.project.insurance.service;

import java.util.List;

import com.project.insurance.dto.response.*;

public interface FraudService {

    FraudAlertResponseDTO analyzeClaim(Long claimId);

    FraudAlertResponseDTO markFraud(Long alertId, boolean fraud);

    List<FraudAlertResponseDTO> getFraudsByClaim(Long claimId);
}