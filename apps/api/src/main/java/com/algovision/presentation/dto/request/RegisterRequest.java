package com.algovision.presentation.dto.request;

import jakarta.validation.constraints.*;

/**
 * RegisterRequest — data sent by the frontend when a user registers.
 *
 * We use a Java Record instead of a class because:
 * - Records are immutable (fields cannot be changed after creation)
 * - Records auto-generate constructor, getters, equals, hashCode, toString
 * - DTOs should never be mutated — records enforce this
 *
 * Jakarta Validation annotations:
 * @NotBlank    — field must not be null or empty string or whitespace only
 * @Email       — field must match email format (x@y.z)
 * @Size        — enforces min/max character length
 * @Pattern     — enforces regex pattern
 */
public record RegisterRequest(

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Pattern(
        regexp = "^[a-zA-Z0-9_]+$",
        message = "Username can only contain letters, numbers, and underscores"
    )
    String username,

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a valid email address")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    String email,

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$",
        message = "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    String password

) {}