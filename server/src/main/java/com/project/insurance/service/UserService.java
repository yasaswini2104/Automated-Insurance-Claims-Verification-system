package com.project.insurance.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.insurance.dto.request.UserRequestDTO;
import com.project.insurance.dto.response.UserResponseDTO;
import com.project.insurance.entity.User;
import com.project.insurance.enums.UserRole;
import com.project.insurance.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserResponseDTO createUser(UserRequestDTO dto) {

        userRepository.findByEmail(dto.getEmail().trim())
                .ifPresent(u -> {
                    throw new IllegalArgumentException("Email already exists: " + dto.getEmail());
                });

        User user = mapToEntity(dto);
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);

        return mapToResponse(user);
    }

    public UserResponseDTO getUserById(Long id) {

        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid user ID");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + id));

        return mapToResponse(user);
    }

    public List<UserResponseDTO> getUsersByRole(String role) {

        UserRole roleEnum = parseRole(role);

        return userRepository.findByRole(roleEnum)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private UserRole parseRole(String role) {

        if (role == null || role.isBlank()) {
            throw new IllegalArgumentException("Role must not be empty");
        }

        try {
            return UserRole.valueOf(role.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid role: " + role);
        }
    }

    private User mapToEntity(UserRequestDTO dto) {
        return User.builder()
                .name(dto.getName().trim())
                .email(dto.getEmail().trim())
                .password(passwordEncoder.encode(dto.getPassword()))
                .role(dto.getRole())
                .build();
    }

    private UserResponseDTO mapToResponse(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }
}