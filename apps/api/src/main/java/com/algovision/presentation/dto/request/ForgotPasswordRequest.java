package com.algovision.presentation.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * ForgotPasswordRequest — user provides their email to receive a reset link.
 *
 * Security note: The API always returns the same success message
 * whether the email exists or not. This prevents user enumeration attacks
 * (attackers probing which emails are registered).
 */
public record ForgotPasswordRequest(

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    String email

) {}