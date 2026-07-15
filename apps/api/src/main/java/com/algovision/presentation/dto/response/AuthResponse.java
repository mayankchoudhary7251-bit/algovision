package com.algovision.presentation.dto.response;

/**
 * AuthResponse — returned after successful login or registration.
 *
 * Contains:
 * - accessToken:  short-lived JWT (15 min) — sent in Authorization header
 * - refreshToken: long-lived token (7 days) — sent to /auth/refresh when access token expires
 * - user:         safe user data for the frontend to display
 *
 * The frontend stores both tokens and the user object.
 * On every API request: Authorization: Bearer {accessToken}
 * When access token expires: POST /auth/refresh with {refreshToken}
 */
public record AuthResponse(
    String accessToken,
    String refreshToken,
    String tokenType,
    long expiresIn,
    UserResponse user
) {
    /**
     * Factory method for cleaner construction.
     * tokenType is always "Bearer" — included so frontend
     * does not need to hardcode it.
     * expiresIn is in seconds — frontend uses this to schedule token refresh.
     */
    public static AuthResponse of(
        String accessToken,
        String refreshToken,
        long expiresInSeconds,
        UserResponse user
    ) {
        return new AuthResponse(accessToken, refreshToken, "Bearer", expiresInSeconds, user);
    }
}