package com.project.insurance.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.insurance.entity.FraudAlert;

public interface FraudAlertRepository extends JpaRepository<FraudAlert, Long> {

    List<FraudAlert> findByClaimId(Long claimId);
}