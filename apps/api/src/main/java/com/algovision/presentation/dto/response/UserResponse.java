package com.algovision.presentation.dto.response;

import com.algovision.domain.entity.User;
import com.algovision.domain.valueobject.Role;

import java.time.Instant;
import java.util.UUID;

/**
 * UserResponse — safe user data returned to the frontend.
 *
 * Notice what is NOT here:
 * - passwordHash (never expose this)
 * - internal database details
 *
 * The static factory method 'from(User user)' converts a domain entity
 * to a response DTO. This keeps mapping logic in one place.
 *
 * Why a Record?
 * The response is immutable — once created, it never changes.
 * Records communicate this intent clearly.
 */
public record UserResponse(
    UUID id,
    String username,
    String email,
    Role role,
    String themePref,
    boolean emailVerified,
    Instant createdAt
) {
    /**
     * Factory method — converts a User entity to a UserResponse.
     * Called in AuthService after login/register.
     *
     * Usage: UserResponse.from(user)
     */
    public static UserResponse from(User user) {
        return new UserResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getRole(),
            user.getThemePref(),
            user.isEmailVerified(),
            user.getCreatedAt()
        );
    }
}