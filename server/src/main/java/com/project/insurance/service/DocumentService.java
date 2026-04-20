package com.project.insurance.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.project.insurance.dto.request.*;
import com.project.insurance.dto.response.*;
import com.project.insurance.entity.*;
import com.project.insurance.enums.*;
import com.project.insurance.repository.*;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final ClaimRepository claimRepository;
    private final UserRepository userRepository;

    //upload document
    public DocumentResponseDTO uploadDocument(DocumentRequestDTO dto) {

        Claim claim = claimRepository.findById(dto.getClaimId())
                .orElseThrow(() -> new IllegalArgumentException("Claim not found"));

        User user = userRepository.findById(dto.getUploadedBy())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Document doc = Document.builder()
                .claim(claim)
                .documentType(dto.getDocumentType())
                .fileUrl(dto.getFileUrl())
                .fileType(dto.getFileType())
                .fileSize(dto.getFileSize())
                .verificationStatus(DocumentVerificationStatus.PENDING)
                .uploadedBy(user)
                .uploadedAt(LocalDateTime.now())
                .build();

        documentRepository.save(doc);

        return mapToResponse(doc);
    }

    //verify document
    public DocumentResponseDTO verifyDocument(Long docId, boolean approved) {

        Document doc = documentRepository.findById(docId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));

        doc.setVerificationStatus(
                approved ? DocumentVerificationStatus.VERIFIED
                         : DocumentVerificationStatus.REJECTED
        );

        doc.setVerifiedAt(LocalDateTime.now());

        documentRepository.save(doc);

        return mapToResponse(doc);
    }

    public List<DocumentResponseDTO> getDocumentsByClaim(Long claimId) {

        return documentRepository.findByClaimId(claimId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private DocumentResponseDTO mapToResponse(Document doc) {
        return DocumentResponseDTO.builder()
                .id(doc.getId())
                .claimId(doc.getClaim().getId())
                .documentType(doc.getDocumentType())
                .fileUrl(doc.getFileUrl())
                .fileType(doc.getFileType())
                .fileSize(doc.getFileSize())
                .verificationStatus(doc.getVerificationStatus())
                .uploadedBy(doc.getUploadedBy().getId())
                .uploadedAt(doc.getUploadedAt())
                .verifiedAt(doc.getVerifiedAt())
                .build();
    }
}