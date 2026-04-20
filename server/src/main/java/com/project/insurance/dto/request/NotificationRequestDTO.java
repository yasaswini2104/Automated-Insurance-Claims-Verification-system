package com.project.insurance.dto.request;

import com.project.insurance.enums.NotificationType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationRequestDTO {
    private Long userId;
    private String message;
    private NotificationType type;
}