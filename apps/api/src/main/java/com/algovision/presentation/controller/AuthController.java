package com.algovision.presentation.controller;

import com.algovision.application.service.AuthService;
import com.algovision.domain.entity.User;
import com.algovision.presentation.dto.request.*;
import com.algovision.presentation.dto.response.AuthResponse;
import com.algovision.presentation.dto.response.UserResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * AuthController — HTTP endpoints for authentication.
 *
 * Design principles:
 * 1. Controllers are THIN — no business logic, only HTTP concerns
 * 2. Every method delegates immediately to AuthService
 * 3. @Valid triggers Jakarta validation on request DTOs before the method runs
 * 4. @AuthenticationPrincipal injects the current logged-in User
 *    (set by JwtAuthenticationFilter in SecurityContext)
 *
 * Base path: /auth (combined with server.servlet.context-path = /api/v1)
 * Full paths: /api/v1/auth/register, /api/v1/auth/login, etc.
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * POST /api/v1/auth/register
     *
     * Register a new user account.
     * Returns 201 Created with tokens so user is logged in immediately.
     *
     * @Valid — triggers RegisterRequest validation before this method runs.
     * If validation fails, Spring throws MethodArgumentNotValidException
     * which GlobalExceptionHandler converts to a 400 response with field errors.
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
        @Valid @RequestBody RegisterRequest request
    ) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * POST /api/v1/auth/login
     *
     * Authenticate with email and password.
     * Returns 200 OK with access token + refresh token.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
        @Valid @RequestBody LoginRequest request
    ) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/v1/auth/refresh
     *
     * Exchange a valid refresh token for a new access token.
     * Called automatically by the Axios interceptor — user never sees this.
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
        @Valid @RequestBody RefreshTokenRequest request
    ) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/v1/auth/logout
     *
     * Revoke all refresh tokens for the current user.
     * Requires authentication — only logged-in users can log out.
     *
     * @AuthenticationPrincipal — Spring injects the User object that
     * JwtAuthenticationFilter placed in the SecurityContext.
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(
        @AuthenticationPrincipal User currentUser
    ) {
        authService.logout(currentUser.getId());
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    /**
     * POST /api/v1/auth/forgot-password
     *
     * Request a password reset email.
     * Always returns success to prevent user enumeration.
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(
        @Valid @RequestBody ForgotPasswordRequest request
    ) {
        String message = authService.forgotPassword(request);
        return ResponseEntity.ok(Map.of("message", message));
    }

    /**
     * POST /api/v1/auth/reset-password
     *
     * Reset password using the token from the email link.
     */
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
        @Valid @RequestBody ResetPasswordRequest request
    ) {
        authService.resetPassword(request);
        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }

    /**
     * GET /api/v1/auth/verify-email?token=xxx
     *
     * Verify a user's email address using the token from the verification email.
     */
    @GetMapping("/verify-email")
    public ResponseEntity<Map<String, String>> verifyEmail(
        @RequestParam String token
    ) {
        authService.verifyEmail(token);
        return ResponseEntity.ok(Map.of("message", "Email verified successfully"));
    }

    /**
     * GET /api/v1/auth/me
     *
     * Get the current authenticated user's profile.
     * Used by the frontend on app startup to restore the user session.
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(
        @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(UserResponse.from(currentUser));
    }
}