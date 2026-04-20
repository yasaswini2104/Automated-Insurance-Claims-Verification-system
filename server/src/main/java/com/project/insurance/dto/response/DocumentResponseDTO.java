package com.project.insurance.dto.response;

import java.time.LocalDateTime;

import com.project.insurance.enums.*;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentResponseDTO {
    private Long id;
    private Long claimId;
    private DocumentType documentType;

    private String fileUrl;
    private String fileType;
    private Long fileSize;

    private DocumentVerificationStatus verificationStatus;

    private Long uploadedBy;

    private LocalDateTime uploadedAt;
    private LocalDateTime verifiedAt;
}