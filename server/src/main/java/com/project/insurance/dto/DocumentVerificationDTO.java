package com.project.insurance.dto;

import com.project.insurance.enums.DocumentVerificationStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentVerificationDTO {
    private DocumentVerificationStatus verificationStatus;
}