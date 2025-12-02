package com.example.farm_marketplace.dto;


import lombok.*;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String address;
    private String state;
    private String district;
    private String phone;
}
