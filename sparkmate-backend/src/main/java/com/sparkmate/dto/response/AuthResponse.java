package com.sparkmate.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    @Builder.Default
    private String type = "Bearer";
    private Long userId;
    private String email;
    private String name;
    private String role;
    private Boolean profileCompleted;
    private Boolean vibeCheckCompleted;
}