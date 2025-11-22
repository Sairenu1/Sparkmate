package com.bookmyshow.service;

import com.bookmyshow.dto.request.LoginRequest;
import com.bookmyshow.dto.request.RegisterRequest;
import com.bookmyshow.dto.response.AuthResponse;
import com.bookmyshow.dto.response.UserResponse;
import com.bookmyshow.entity.User;
import com.bookmyshow.exception.BadRequestException;
import com.bookmyshow.repository.UserRepository;
import com.bookmyshow.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }
        
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(User.Role.USER);
        
        user = userRepository.save(user);
        
        String accessToken = jwtUtil.generateAccessToken(user.getEmail(), user.getRole().name());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());
        
        return new AuthResponse(accessToken, refreshToken, "Bearer", UserResponse.fromEntity(user));
    }
    
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new BadRequestException("User not found"));
        
        String accessToken = jwtUtil.generateAccessToken(user.getEmail(), user.getRole().name());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());
        
        return new AuthResponse(accessToken, refreshToken, "Bearer", UserResponse.fromEntity(user));
    }
    
    public AuthResponse refreshToken(String refreshToken) {
        try {
            String email = jwtUtil.extractUsername(refreshToken);
            if (!jwtUtil.validateToken(refreshToken, email)) {
                throw new BadRequestException("Invalid refresh token");
            }
            
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));
            
            String newAccessToken = jwtUtil.generateAccessToken(user.getEmail(), user.getRole().name());
            String newRefreshToken = jwtUtil.generateRefreshToken(user.getEmail());
            
            return new AuthResponse(newAccessToken, newRefreshToken, "Bearer", UserResponse.fromEntity(user));
        } catch (Exception e) {
            throw new BadRequestException("Invalid refresh token");
        }
    }
}

