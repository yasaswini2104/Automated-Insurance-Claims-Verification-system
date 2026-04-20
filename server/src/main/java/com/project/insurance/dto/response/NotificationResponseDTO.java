package com.project.insurance.dto.response;

import java.time.LocalDateTime;

import com.project.insurance.enums.NotificationStatus;
import com.project.insurance.enums.NotificationType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponseDTO {

    private Long id;

    private Long userId;

    private String message;

    private NotificationType type;
    private NotificationStatus status;

    private LocalDateTime createdAt;
}