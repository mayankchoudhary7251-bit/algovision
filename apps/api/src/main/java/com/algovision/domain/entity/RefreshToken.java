package com.algovision.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

/**
 * RefreshToken — stores issued refresh tokens in the database.
 *
 * Why store refresh tokens in the DB?
 * JWT access tokens are stateless — the server cannot invalidate them
 * before they expire. But refresh tokens ARE stored in the DB, which means:
 * - We can revoke them on logout (delete from DB)
 * - We can detect token reuse attacks
 * - We can expire them server-side even if the JWT hasn't expired
 *
 * This table maps to: refresh_tokens
 */
@Entity
@Table(name = "refresh_tokens")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * The actual token string — a random UUID or secure random string.
     * Stored as-is (not hashed) because we need to look it up by value.
     * unique = true ensures one token per row (prevents duplicate tokens)
     */
    @Column(nullable = false, unique = true, length = 512)
    private String token;

    /**
     * Many refresh tokens can belong to one user.
     * (User can be logged in from multiple devices)
     * FetchType.LAZY — don't load the User object unless we explicitly access it
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * When this refresh token expires.
     * The AuthService checks: if (refreshToken.getExpiresAt().isBefore(Instant.now())) → reject
     */
    @Column(nullable = false)
    private Instant expiresAt;

    /**
     * Whether this token has been used or revoked.
     * On logout: set revoked = true instead of deleting
     * (keeps audit trail of token usage)
     */
    @Column(nullable = false)
    @Builder.Default
    private boolean revoked = false;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
}