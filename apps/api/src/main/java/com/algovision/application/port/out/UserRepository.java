package com.algovision.application.port.out;

import com.algovision.domain.entity.User;

import java.util.Optional;
import java.util.UUID;

/**
 * UserRepository — output port (interface) for user persistence.
 *
 * This interface is defined in the Application layer.
 * The Infrastructure layer provides the JPA implementation.
 *
 * Why Optional<User> instead of User?
 * Optional forces the caller to handle the "not found" case explicitly.
 * If we returned User directly, callers could forget to check for null
 * and get NullPointerExceptions at runtime.
 */
public interface UserRepository {

    /**
     * Save a new user or update an existing one.
     * Returns the saved entity (may have generated ID populated).
     */
    User save(User user);

    /**
     * Find a user by their unique ID.
     * Used when loading a user from a JWT token's subject claim.
     */
    Optional<User> findById(UUID id);

    /**
     * Find a user by email address.
     * Used during login to look up the user before password verification.
     */
    Optional<User> findByEmail(String email);

    /**
     * Find a user by username.
     * Used during registration to check if username is already taken.
     */
    Optional<User> findByUsername(String username);

    /**
     * Check if an email is already registered.
     * More efficient than findByEmail — only runs a COUNT query, not SELECT *.
     */
    boolean existsByEmail(String email);

    /**
     * Check if a username is already taken.
     */
    boolean existsByUsername(String username);
}