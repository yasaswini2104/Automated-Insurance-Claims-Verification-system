package com.project.insurance.dto;

import com.project.insurance.enums.NotificationStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationUpdateDTO {

    private NotificationStatus status; 
}