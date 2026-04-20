package com.project.insurance.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.insurance.entity.Policies;

public interface PolicyRepository extends JpaRepository<Policies, Long> {

    List<Policies> findByPolicyHolderId(Long policyHolderId);
}