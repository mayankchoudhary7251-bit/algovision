package com.algovision.presentation.exception;

import com.algovision.domain.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

/**
 * GlobalExceptionHandler — catches all exceptions and returns clean JSON.
 *
 * @RestControllerAdvice — applies to all @RestController classes globally.
 * Without this, Spring returns HTML error pages or raw stack traces.
 *
 * We use RFC 7807 ProblemDetail format:
 * {
 *   "type": "https://algovision.dev/errors/not-found",
 *   "title": "Resource Not Found",
 *   "status": 404,
 *   "detail": "User not found with id: 123"
 * }
 *
 * This is the industry standard for REST API error responses.
 * Spring 6 has built-in ProblemDetail support — no custom class needed.
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    private static final String ERROR_BASE_URI = "https://algovision.dev/errors/";

    /**
     * Handle validation errors — triggered when @Valid fails on a request body.
     * Returns all field errors at once so the frontend can highlight multiple fields.
     *
     * Example response:
     * {
     *   "status": 400,
     *   "title": "Validation Failed",
     *   "errors": { "email": "must be a valid email", "password": "must be 8+ chars" }
     * }
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidationException(MethodArgumentNotValidException ex) {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        problem.setType(URI.create(ERROR_BASE_URI + "validation"));
        problem.setTitle("Validation Failed");
        problem.setDetail("Request body has validation errors");

        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }
        problem.setProperty("errors", fieldErrors);

        return problem;
    }

    /**
     * Handle wrong email or password during login.
     * Spring Security throws this when credentials do not match.
     *
     * Security note: Return a generic message — never reveal whether
     * the email or the password was wrong (prevents user enumeration).
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ProblemDetail handleBadCredentials(BadCredentialsException ex) {
        log.warn("Failed login attempt: {}", ex.getMessage());
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.UNAUTHORIZED);
        problem.setType(URI.create(ERROR_BASE_URI + "unauthorized"));
        problem.setTitle("Authentication Failed");
        problem.setDetail("Invalid email or password");
        return problem;
    }

    /**
     * Handle resource not found — user, topic, quiz question etc.
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleResourceNotFound(ResourceNotFoundException ex) {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
        problem.setType(URI.create(ERROR_BASE_URI + "not-found"));
        problem.setTitle("Resource Not Found");
        problem.setDetail(ex.getMessage());
        return problem;
    }

    /**
     * Handle business rule violations — duplicate email, invalid token etc.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ProblemDetail handleIllegalArgument(IllegalArgumentException ex) {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        problem.setType(URI.create(ERROR_BASE_URI + "bad-request"));
        problem.setTitle("Bad Request");
        problem.setDetail(ex.getMessage());
        return problem;
    }

    /**
     * Handle disabled accounts.
     */
    @ExceptionHandler(DisabledException.class)
    public ProblemDetail handleDisabled(DisabledException ex) {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.FORBIDDEN);
        problem.setType(URI.create(ERROR_BASE_URI + "account-disabled"));
        problem.setTitle("Account Disabled");
        problem.setDetail("Your account has been disabled. Please contact support.");
        return problem;
    }

    /**
     * Handle locked accounts.
     */
    @ExceptionHandler(LockedException.class)
    public ProblemDetail handleLocked(LockedException ex) {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.FORBIDDEN);
        problem.setType(URI.create(ERROR_BASE_URI + "account-locked"));
        problem.setTitle("Account Locked");
        problem.setDetail("Your account has been locked. Please contact support.");
        return problem;
    }

    /**
     * Catch-all — handles any unexpected exception.
     * Logs the full stack trace for debugging but returns a safe message to the client.
     * Never expose internal error details to clients in production.
     */
    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGenericException(Exception ex) {
        log.error("Unexpected error: {}", ex.getMessage(), ex);
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        problem.setType(URI.create(ERROR_BASE_URI + "internal-error"));
        problem.setTitle("Internal Server Error");
        problem.setDetail("An unexpected error occurred. Please try again later.");
        return problem;
    }
}