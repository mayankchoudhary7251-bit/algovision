package com.algovision.application.port.out;

import com.algovision.domain.entity.RefreshToken;
import com.algovision.domain.entity.User;

import java.util.Optional;

/**
 * RefreshTokenRepository — output port for refresh token persistence.
 *
 * Refresh tokens are stored in the DB so we can:
 * 1. Revoke them on logout
 * 2. Detect reuse attacks (if a revoked token is presented, someone is attacking)
 * 3. Expire them server-side
 */
public interface RefreshTokenRepository {

    /**
     * Save a new refresh token.
     */
    RefreshToken save(RefreshToken refreshToken);

    /**
     * Find a refresh token by its string value.
     * Used when the client sends a refresh request.
     */
    Optional<RefreshToken> findByToken(String token);

    /**
     * Delete all refresh tokens for a specific user.
     * Called on logout to invalidate all sessions across all devices.
     */
    void deleteAllByUser(User user);

    /**
     * Revoke a specific token (mark as used, don't delete).
     * Keeps an audit trail of token usage.
     */
    void revokeToken(String token);
}