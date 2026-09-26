package com.algovision.presentation.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CodeExecutionRequest(
    @NotBlank(message = "Source code is required")
    String sourceCode,
    @NotNull(message = "Language is required")
    String language,
    String stdin
) {}