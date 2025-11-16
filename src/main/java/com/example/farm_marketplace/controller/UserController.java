package com.example.farm_marketplace.controller;

import com.example.farm_marketplace.dto.UserResponse;
import com.example.farm_marketplace.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    /**
     * Get current logged-in user profile
     * GET /api/users/me
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        UserResponse response = userService.getUserProfile(email);
        return ResponseEntity.ok(response);
    }

    /**
     * Update current user profile
     * PUT /api/users/me
     */
    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(
            Authentication authentication,
            @RequestBody UserResponse updateRequest) {
        String email = authentication.getName();
        UserResponse response = userService.updateUserProfile(email, updateRequest);
        return ResponseEntity.ok(response);
    }

    /**
     * Get user by ID (for viewing farmer/buyer details)
     * GET /api/users/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        UserResponse response = userService.getUserById(id);
        return ResponseEntity.ok(response);
    }
}
