package com.project.insurance.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.insurance.dto.request.*;
import com.project.insurance.dto.response.*;
import com.project.insurance.service.DocumentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    //upload
    @PostMapping
    public ResponseEntity<DocumentResponseDTO> uploadDocument(
            @Valid @RequestBody DocumentRequestDTO dto) {

        return ResponseEntity.ok(documentService.uploadDocument(dto));
    }

    //verify
    @PutMapping("/{id}/verify")
    public ResponseEntity<DocumentResponseDTO> verifyDocument(
            @PathVariable Long id,
            @RequestParam boolean approved) {

        return ResponseEntity.ok(documentService.verifyDocument(id, approved));
    }

    //get by claim
    @GetMapping("/claim/{claimId}")
    public ResponseEntity<List<DocumentResponseDTO>> getDocumentsByClaim(
            @PathVariable Long claimId) {

        return ResponseEntity.ok(documentService.getDocumentsByClaim(claimId));
    }
}