package com.example.farm_marketplace.service;



import com.example.farm_marketplace.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JwtService {
    private final JwtUtil jwtUtil;

    public String generateToken(String email, String role) {
        return jwtUtil.generateToken(email, role);
    }

    public String extractEmail(String token) {
        return jwtUtil.getEmailFromToken(token);
    }

    public String extractRole(String token) {
        return jwtUtil.getRoleFromToken(token);
    }

    public boolean validateToken(String token) {
        return jwtUtil.validateToken(token);
    }
}
