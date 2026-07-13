package com.algovision.application.service;

import com.algovision.application.port.out.EmailVerificationTokenRepository;
import com.algovision.application.port.out.RefreshTokenRepository;
import com.algovision.application.port.out.UserRepository;
import com.algovision.domain.entity.EmailVerificationToken;
import com.algovision.domain.entity.RefreshToken;
import com.algovision.domain.entity.User;
import com.algovision.domain.exception.ResourceNotFoundException;
import com.algovision.infrastructure.security.JwtService;
import com.algovision.presentation.dto.request.*;
import com.algovision.presentation.dto.response.AuthResponse;
import com.algovision.presentation.dto.response.UserResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

/**
 * AuthService — all authentication business logic in one place.
 *
 * @Slf4j — Lombok generates a logger field: log.info(), log.error() etc.
 * @Transactional — wraps each method in a DB transaction automatically.
 * If any exception is thrown, the transaction rolls back (no partial saves).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    // Refresh token lives for 7 days
    private static final long REFRESH_TOKEN_EXPIRY_DAYS = 7;

    // Email verification token lives for 24 hours
    private static final long EMAIL_TOKEN_EXPIRY_HOURS = 24;

    /**
     * REGISTER — creates a new user account.
     *
     * Steps:
     * 1. Check email and username are not already taken
     * 2. Hash the password with BCrypt
     * 3. Save the user
     * 4. Generate email verification token (Phase 3: send actual email)
     * 5. Issue access + refresh tokens so user is logged in immediately
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new user with email: {}", request.email());

        // Step 1: Check for duplicates
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email is already registered");
        }
        if (userRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("Username is already taken");
        }

        // Step 2: Build and save the user
        // Note: request.password() is the plain text password from the form
        // passwordEncoder.encode() converts it to a BCrypt hash like "$2a$12$..."
        User user = User.builder()
            .username(request.username())
            .email(request.email())
            .passwordHash(passwordEncoder.encode(request.password()))
            .emailVerified(false)
            .build();

        user = userRepository.save(user);
        log.info("User registered successfully with id: {}", user.getId());

        // Step 3: Create email verification token
        // In a real app, we would email this token to the user
        // For now we create it so the flow is complete
        createEmailVerificationToken(user);

        // Step 4: Issue tokens so the user is logged in immediately after registration
        return issueTokens(user);
    }

    /**
     * LOGIN — authenticates a user and issues tokens.
     *
     * Steps:
     * 1. Delegate to Spring Security's AuthenticationManager
     *    (it calls UserDetailsService → loads user → BCrypt compares passwords)
     * 2. If authentication fails, AuthenticationManager throws BadCredentialsException
     * 3. If successful, load the full User entity and issue tokens
     */
    @Transactional
    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.email());

        // This single line does all the heavy lifting:
        // - Loads the user by email via UserDetailsService
        // - Compares the provided password with the stored BCrypt hash
        // - Throws AuthenticationException if credentials are wrong
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.email(),
                request.password()
            )
        );

        // Authentication succeeded — load the full User entity
        User user = userRepository.findByEmail(request.email())
            .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.email()));

        log.info("User logged in successfully: {}", user.getId());

        // Revoke all existing refresh tokens for this user before issuing a new one
        // This implements single-session-per-login behavior
        // Remove this line to support multiple simultaneous sessions
        refreshTokenRepository.deleteAllByUser(user);

        return issueTokens(user);
    }

    /**
     * REFRESH TOKEN — issues a new access token using a valid refresh token.
     *
     * Called by the Axios interceptor when a 401 is received.
     * The frontend never needs to show a login screen for this.
     */
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        log.info("Refresh token request received");

        // Look up the refresh token in the database
        RefreshToken refreshToken = refreshTokenRepository
            .findByToken(request.refreshToken())
            .orElseThrow(() -> new IllegalArgumentException("Refresh token not found"));

        // Check it has not been revoked
        if (refreshToken.isRevoked()) {
            log.warn("Attempt to use revoked refresh token for user: {}",
                refreshToken.getUser().getId());
            throw new IllegalArgumentException("Refresh token has been revoked");
        }

        // Check it has not expired
        if (refreshToken.getExpiresAt().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Refresh token has expired. Please log in again.");
        }

        // Revoke the used token (rotation — each refresh issues a new refresh token)
        // Token rotation means even if a refresh token is stolen, it can only be used once
        refreshTokenRepository.revokeToken(request.refreshToken());

        // Issue brand new tokens
        User user = refreshToken.getUser();
        log.info("Issuing new tokens for user: {}", user.getId());
        return issueTokens(user);
    }

    /**
     * LOGOUT — revokes all refresh tokens for the user.
     *
     * Access tokens cannot be revoked (they are stateless JWT).
     * They expire naturally after 15 minutes.
     * The frontend deletes them immediately on logout so they cannot be used.
     */
    @Transactional
    public void logout(UUID userId) {
        log.info("Logging out user: {}", userId);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId.toString()));
        refreshTokenRepository.deleteAllByUser(user);
        log.info("All refresh tokens revoked for user: {}", userId);
    }

    /**
     * FORGOT PASSWORD — generates a reset token and (eventually) emails it.
     *
     * Security: Always return the same message whether the email exists or not.
     * This prevents user enumeration attacks.
     */
    @Transactional
    public String forgotPassword(ForgotPasswordRequest request) {
        log.info("Forgot password request for email: {}", request.email());

        userRepository.findByEmail(request.email()).ifPresent(user -> {
            // In Phase 3: send actual email with reset link
            // For now: log the token (development only)
            String token = UUID.randomUUID().toString();
            log.info("Password reset token for {}: {}", request.email(), token);
            // TODO Phase 3: emailService.sendPasswordResetEmail(user, token)
        });

        // Always return same message regardless of whether email exists
        return "If that email is registered, you will receive a password reset link shortly.";
    }

    /**
     * RESET PASSWORD — validates the reset token and updates the password.
     */
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        log.info("Password reset attempt with token");
        // TODO Phase 3: implement with PasswordResetToken entity
        // For now: placeholder that will be completed with email service
        throw new UnsupportedOperationException(
            "Password reset via email will be implemented in Phase 3"
        );
    }

    /**
     * VERIFY EMAIL — marks a user's email as verified.
     */
    @Transactional
    public void verifyEmail(String token) {
        EmailVerificationToken verificationToken = emailVerificationTokenRepository
            .findByToken(token)
            .orElseThrow(() -> new IllegalArgumentException("Invalid verification token"));

        if (verificationToken.isUsed()) {
            throw new IllegalArgumentException("Verification token has already been used");
        }

        if (verificationToken.getExpiresAt().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Verification token has expired");
        }

        User user = verificationToken.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);

        verificationToken.setUsed(true);
        emailVerificationTokenRepository.save(verificationToken);

        log.info("Email verified for user: {}", user.getId());
    }

    // ─────────────────────────────────────────────────────────────
    // Private helper methods
    // ─────────────────────────────────────────────────────────────

    /**
     * Issue a new access token + refresh token pair.
     * Called after successful login, registration, and token refresh.
     */
    private AuthResponse issueTokens(User user) {
        String accessToken = jwtService.generateAccessToken(user);
        String refreshTokenValue = generateAndSaveRefreshToken(user);
        return AuthResponse.of(
            accessToken,
            refreshTokenValue,
            jwtService.getAccessTokenExpirationSeconds(),
            UserResponse.from(user)
        );
    }

    /**
     * Generate a secure random refresh token and persist it.
     */
    private String generateAndSaveRefreshToken(User user) {
        String tokenValue = UUID.randomUUID().toString();
        RefreshToken refreshToken = RefreshToken.builder()
            .token(tokenValue)
            .user(user)
            .expiresAt(Instant.now().plus(REFRESH_TOKEN_EXPIRY_DAYS, ChronoUnit.DAYS))
            .build();
        refreshTokenRepository.save(refreshToken);
        return tokenValue;
    }

    /**
     * Generate and save an email verification token.
     */
    private void createEmailVerificationToken(User user) {
        String tokenValue = UUID.randomUUID().toString();
        EmailVerificationToken token = EmailVerificationToken.builder()
            .token(tokenValue)
            .user(user)
            .expiresAt(Instant.now().plus(EMAIL_TOKEN_EXPIRY_HOURS, ChronoUnit.HOURS))
            .build();
        emailVerificationTokenRepository.save(token);
    }
}