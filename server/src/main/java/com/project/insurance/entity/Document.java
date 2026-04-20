package com.project.insurance.entity;

import java.time.LocalDateTime;

import com.project.insurance.enums.DocumentType;
import com.project.insurance.enums.DocumentVerificationStatus;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "claim_id", nullable = false)
    private Claim claim;

    @Enumerated(EnumType.STRING)
    @Column(name = "document_type")
    private DocumentType documentType;

    @Column(name = "file_url")
    private String fileUrl;

    @Column(name = "file_type")
    private String fileType;

    @Column(name = "file_size")
    private Long fileSize;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status")
    private DocumentVerificationStatus verificationStatus;

    @ManyToOne
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;

    private LocalDateTime uploadedAt;
    private LocalDateTime verifiedAt;
}