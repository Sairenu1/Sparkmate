package com.sparkmate.service;

import com.sparkmate.dto.request.LoginRequest;
import com.sparkmate.dto.request.SignupRequest;
import com.sparkmate.dto.response.AuthResponse;
import com.sparkmate.exception.BadRequestException;
import com.sparkmate.exception.UnauthorizedException;
import com.sparkmate.model.Profile;
import com.sparkmate.model.User;
import com.sparkmate.model.UserAnalytics;
import com.sparkmate.repository.ProfileRepository;
import com.sparkmate.repository.UserAnalyticsRepository;
import com.sparkmate.repository.UserRepository;
import com.sparkmate.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final UserRepository userRepository;
        private final ProfileRepository profileRepository;
        private final UserAnalyticsRepository analyticsRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtUtil jwtUtil;
        private final AuthenticationManager authenticationManager;

        @Transactional
        public AuthResponse signup(SignupRequest request) {
                // Check if email already exists
                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new BadRequestException("Email is already registered");
                }

                // Create user
                User user = User.builder()
                                .name(request.getName())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(User.Role.USER)
                                .isActive(true) // This is fine
                                .emailVerified(false) // ✅ Corrected
                                .build();

                user = userRepository.save(user);

                // Create empty profile
                Profile profile = Profile.builder()
                                .user(user)
                                .profileCompleted(false)
                                .vibeCheckCompleted(false)
                                .build();

                profileRepository.save(profile);

                // Create analytics
                UserAnalytics analytics = UserAnalytics.builder()
                                .user(user)
                                .build();

                analyticsRepository.save(analytics);

                // Generate JWT token
                String token = jwtUtil.generateToken(user.getEmail(), user.getId());

                return AuthResponse.builder()
                                .token(token)
                                .type("Bearer")
                                .userId(user.getId())
                                .email(user.getEmail())
                                .name(user.getName())
                                .role(user.getRole().name())
                                .profileCompleted(false)
                                .vibeCheckCompleted(false)
                                .build();
        }

        public AuthResponse login(LoginRequest request) {
                try {
                        // Authenticate user
                        Authentication authentication = authenticationManager.authenticate(
                                        new UsernamePasswordAuthenticationToken(
                                                        request.getEmail(),
                                                        request.getPassword()));

                        // Get user details
                        User user = userRepository.findByEmail(request.getEmail())
                                        .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

                        // Check if user is active
                        if (!user.getIsActive()) {
                                throw new UnauthorizedException("Account is deactivated");
                        }

                        // Update last active
                        user.setLastActive(java.time.LocalDateTime.now());
                        userRepository.save(user);

                        // Get profile info
                        Profile profile = profileRepository.findByUserId(user.getId())
                                        .orElse(null);

                        // Generate JWT token
                        String token = jwtUtil.generateToken(user.getEmail(), user.getId());

                        return AuthResponse.builder()
                                        .token(token)
                                        .type("Bearer")
                                        .userId(user.getId())
                                        .email(user.getEmail())
                                        .name(user.getName())
                                        .role(user.getRole().name())
                                        .profileCompleted(profile != null && profile.getProfileCompleted())
                                        .vibeCheckCompleted(profile != null && profile.getVibeCheckCompleted())
                                        .build();

                } catch (AuthenticationException e) {
                        throw new UnauthorizedException("Invalid email or password");
                }
        }
}
