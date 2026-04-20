package com.project.insurance.dto.request;

import com.project.insurance.enums.DocumentType;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentRequestDTO {
    @NotNull(message = "Claim ID is required")
    private Long claimId;

    @NotNull(message = "Document type is required")
    private DocumentType documentType;

    @NotBlank(message = "File URL is required")
    private String fileUrl;

    private String fileType;

    private Long fileSize;

    @NotNull(message = "UploadedBy user ID is required")
    private Long uploadedBy;
}