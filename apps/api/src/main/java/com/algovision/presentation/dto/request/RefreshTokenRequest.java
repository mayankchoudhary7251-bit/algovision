package com.algovision.presentation.dto.request;

import jakarta.validation.constraints.NotBlank;

/**
 * RefreshTokenRequest — sent when the access token has expired.
 *
 * The frontend sends the stored refresh token.
 * The server validates it and returns a new access token.
 */
public record RefreshTokenRequest(

    @NotBlank(message = "Refresh token is required")
    String refreshToken

) {}