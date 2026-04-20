package com.project.insurance.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.insurance.entity.Document;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByClaimId(Long claimId);
}