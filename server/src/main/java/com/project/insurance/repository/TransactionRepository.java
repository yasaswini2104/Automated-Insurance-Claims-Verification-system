package com.project.insurance.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.insurance.entity.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByClaimId(Long claimId);
}