package com.sparkmate.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class SignupRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    @JsonProperty("name")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @JsonProperty("email")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
    @JsonProperty("password")
    private String password;

    // Optional fields for future use
    @JsonProperty("gender")
    private String gender;

    @JsonProperty("age")
    @Min(value = 18, message = "You must be at least 18 years old")
    @Max(value = 100, message = "Age must be less than 100")
    private Integer age;

    @JsonProperty("location")
    @Size(max = 100, message = "Location must be less than 100 characters")
    private String location;

    @JsonProperty("bio")
    @Size(max = 500, message = "Bio must be less than 500 characters")
    private String bio;
}