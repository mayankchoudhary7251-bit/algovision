package com.algovision.infrastructure.security;

import com.algovision.application.port.out.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

/**
 * JwtAuthenticationFilter — intercepts every HTTP request.
 *
 * Flow for a protected request:
 * 1. Extract "Authorization: Bearer <token>" header
 * 2. Validate the token with JwtService
 * 3. Load the user from the database
 * 4. Set the user in Spring Security's SecurityContext
 * 5. The request proceeds to the controller
 *
 * If any step fails: SecurityContext stays empty → Spring Security
 * returns 401 Unauthorized automatically.
 *
 * OncePerRequestFilter guarantees this runs exactly once per request
 * (not once per servlet forward/include, which can happen in Spring MVC).
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // Step 1: Extract the Authorization header
        final String authHeader = request.getHeader("Authorization");

        // If no Authorization header or it does not start with "Bearer ", skip
        // The request will proceed without authentication → public endpoints work
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Step 2: Extract the token (remove "Bearer " prefix)
        final String token = authHeader.substring(7);

        // Step 3: Validate the token
        if (!jwtService.isTokenValid(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Step 4: Extract user ID from token and load user from DB
        final UUID userId = jwtService.extractUserId(token);
        userRepository.findById(userId).ifPresent(user -> {

            // Step 5: Create Spring Security authentication object
            // SimpleGrantedAuthority needs "ROLE_" prefix for Spring Security
            var authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().name());
            var authentication = new UsernamePasswordAuthenticationToken(
                user,           // principal — the authenticated user object
                null,           // credentials — null because JWT already verified identity
                List.of(authority)
            );
            authentication.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request)
            );

            // Step 6: Register the authentication in the SecurityContext
            // This is what makes SecurityContextHolder.getContext().getAuthentication() work
            // in controllers — they can call it to get the logged-in user
            SecurityContextHolder.getContext().setAuthentication(authentication);
        });

        // Step 7: Continue the filter chain regardless
        filterChain.doFilter(request, response);
    }
}