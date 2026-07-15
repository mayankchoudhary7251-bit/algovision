package com.algovision.presentation.dto.request;

import jakarta.validation.constraints.NotBlank;

/**
 * LoginRequest — credentials sent during login.
 *
 * We accept email as the login identifier.
 * Some systems accept username OR email — we keep it simple with email only.
 */
public record LoginRequest(

    @NotBlank(message = "Email is required")
    String email,

    @NotBlank(message = "Password is required")
    String password

) {}