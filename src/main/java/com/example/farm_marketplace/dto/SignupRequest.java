package com.example.farm_marketplace.dto;


import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class SignupRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Role is required")
    @Pattern(regexp = "FARMER|BUYER", message = "Role must be FARMER or BUYER")
    private String role;

    private String address;
    private String state;
    private String district;
    private String phone;
}
