package com.algovision.infrastructure.security;

import com.algovision.domain.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * JwtService — generates, validates, and parses JWT access tokens.
 *
 * Lives in Infrastructure layer because it depends on the jjwt library.
 * The Application layer (AuthService) calls this via direct injection
 * since this is a pure utility — it has no business logic.
 *
 * Algorithm: HMAC-SHA256 (HS256)
 * - Symmetric: same secret key signs and verifies
 * - Fast and sufficient for a single-server application
 * - For multi-server setups, RS256 (asymmetric) is preferred
 */
@Service
public class JwtService {

    /**
     * The secret key used to sign tokens.
     * Read from application.yml → app.jwt.secret → set in .env
     * Must be at least 256 bits (32 characters) for HS256.
     * NEVER hardcode this — always use environment variables.
     */
    @Value("${app.jwt.secret}")
    private String secretKeyString;

    /**
     * How long access tokens live (in milliseconds).
     * Default: 900000 ms = 15 minutes
     * Short expiry limits damage if a token is stolen.
     */
    @Value("${app.jwt.access-token-expiration-ms}")
    private long accessTokenExpirationMs;

    /**
     * Converts the string secret into a cryptographic key object.
     * Called lazily — only when we actually need to sign or verify.
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKeyString.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Generate an access token for a user.
     *
     * Claims we embed in the token:
     * - sub (subject): user's UUID — used to identify the user on each request
     * - email: stored for convenience (frontend can decode and display it)
     * - role: used for authorization checks
     * - iat (issued at): automatic timestamp
     * - exp (expires at): when the token becomes invalid
     */
    public String generateAccessToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", user.getEmail());
        claims.put("role", user.getRole().name());
        claims.put("username", user.getUsername());

        return Jwts.builder()
            .claims(claims)
            .subject(user.getId().toString())   // sub = user UUID
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + accessTokenExpirationMs))
            .signWith(getSigningKey())
            .compact();
    }

    /**
     * Extract the user ID from a token.
     * The subject claim contains the UUID we embedded during generation.
     */
    public UUID extractUserId(String token) {
        return UUID.fromString(extractClaims(token).getSubject());
    }

    /**
     * Extract the email from a token.
     */
    public String extractEmail(String token) {
        return extractClaims(token).get("email", String.class);
    }

    /**
     * Validate a token — checks:
     * 1. Signature is valid (token was signed by us, not forged)
     * 2. Token has not expired
     *
     * Returns false instead of throwing — callers handle invalid tokens
     * by returning 401, not by crashing.
     */
    public boolean isTokenValid(String token) {
        try {
            extractClaims(token); // throws if invalid or expired
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Check if a token is expired without throwing an exception.
     */
    public boolean isTokenExpired(String token) {
        try {
            return extractClaims(token).getExpiration().before(new Date());
        } catch (JwtException e) {
            return true; // treat unparseable tokens as expired
        }
    }

    /**
     * Get the expiration time in seconds (for AuthResponse.expiresIn).
     */
    public long getAccessTokenExpirationSeconds() {
        return accessTokenExpirationMs / 1000;
    }

    /**
     * Parse and return all claims from a token.
     * This is where jjwt verifies the signature and checks expiry.
     * Throws JwtException if anything is wrong.
     */
    private Claims extractClaims(String token) {
        return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}