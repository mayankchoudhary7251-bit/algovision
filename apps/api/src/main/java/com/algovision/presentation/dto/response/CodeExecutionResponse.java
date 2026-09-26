package com.algovision.presentation.dto.response;

public record CodeExecutionResponse(
    String output,
    String error,
    String executionTime,
    String memoryUsed,
    String status,
    String language
) {
    public static CodeExecutionResponse success(
        String output, String executionTime, String memoryUsed, String language
    ) {
        return new CodeExecutionResponse(output, null, executionTime, memoryUsed, "SUCCESS", language);
    }

    public static CodeExecutionResponse error(String status, String error, String language) {
        return new CodeExecutionResponse(null, error, null, null, status, language);
    }
}