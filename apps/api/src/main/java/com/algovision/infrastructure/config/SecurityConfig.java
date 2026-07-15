package com.algovision.infrastructure.config;

import com.algovision.infrastructure.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.algovision.application.port.out.UserRepository;

import java.util.List;

/**
 * SecurityConfig — the central security configuration for AlgoVision API.
 *
 * Key decisions:
 * 1. STATELESS sessions — no server-side session, every request must carry a JWT
 * 2. CSRF disabled — not needed for stateless REST APIs (CSRF attacks require cookies/sessions)
 * 3. JWT filter runs BEFORE Spring's default UsernamePasswordAuthenticationFilter
 * 4. BCrypt with strength 12 — industry standard for password hashing
 *
 * @EnableWebSecurity — activates Spring Security's web security support
 * @EnableMethodSecurity — enables @PreAuthorize annotations on controllers
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserRepository userRepository;

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    /**
     * PUBLIC_ENDPOINTS — these URLs require no authentication.
     * Anything not listed here requires a valid JWT.
     */
    private static final String[] PUBLIC_ENDPOINTS = {
        "/auth/**",          // login, register, refresh, forgot-password, reset-password
        "/health",           // health check (used by Docker and deployment platforms)
        "/actuator/health",  // Spring Boot actuator health
        "/actuator/info",
    };

    /**
     * SecurityFilterChain — defines the security rules for every HTTP request.
     *
     * The order of rules matters: Spring Security applies them top-to-bottom.
     * More specific rules should come before more general ones.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            // Disable CSRF — safe for REST APIs because:
            // 1. We use JWT in Authorization header (not cookies)
            // 2. CSRF attacks exploit cookie-based authentication
            .csrf(AbstractHttpConfigurer::disable)

            // Configure CORS using our corsConfigurationSource bean below
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // Authorization rules
            .authorizeHttpRequests(auth -> auth
                // Public endpoints — no token required
                .requestMatchers(PUBLIC_ENDPOINTS).permitAll()
                // Admin-only endpoints
                .requestMatchers("/admin/**").hasRole("ADMIN")
                // Everything else requires authentication
                .anyRequest().authenticated()
            )

            // STATELESS — no HTTP sessions, no cookies, JWT only
            // This means Spring Security never stores SecurityContext between requests
            // Every request must re-authenticate via JWT
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // Register our JWT filter BEFORE Spring's default auth filter
            // This ensures JWT authentication runs first on every request
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            )

            .build();
    }

    /**
     * CORS Configuration — allows the React frontend (different origin) to call our API.
     *
     * Without CORS configuration, browsers block requests from localhost:5173 to localhost:8080
     * because they are on different ports (different origins).
     *
     * In production: allowedOrigins should be your Vercel URL only.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Allow requests from the frontend origin (set in .env)
        config.setAllowedOrigins(List.of(allowedOrigins.split(",")));

        // Allow these HTTP methods
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        // Allow these headers (Authorization is critical — it carries the JWT)
        config.setAllowedHeaders(List.of(
            "Authorization",
            "Content-Type",
            "Accept",
            "Origin",
            "X-Requested-With"
        ));

        // Allow the Authorization header to be read by the frontend
        config.setExposedHeaders(List.of("Authorization"));

        // Allow cookies/credentials in cross-origin requests
        config.setAllowCredentials(true);

        // Cache preflight response for 1 hour (reduces OPTIONS requests)
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    /**
     * UserDetailsService — tells Spring Security how to load a user by email.
     *
     * Spring Security calls this during authentication to get the user's
     * stored password hash for comparison with the provided password.
     *
     * We load the user by email since that is our login identifier.
     */
    @Bean
    public UserDetailsService userDetailsService() {
        return email -> userRepository.findByEmail(email)
            .map(user -> org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPasswordHash())
                .roles(user.getRole().name())
                .build()
            )
            .orElseThrow(() -> new UsernameNotFoundException(
                "User not found with email: " + email
            ));
    }

    /**
     * AuthenticationProvider — wires together the UserDetailsService and PasswordEncoder.
     *
     * DaoAuthenticationProvider is Spring Security's standard implementation for
     * database-backed authentication. It:
     * 1. Loads the user via UserDetailsService
     * 2. Compares the provided password with the stored hash via PasswordEncoder
     * 3. Returns an authenticated token if they match
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService());
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    /**
     * AuthenticationManager — the entry point for triggering authentication.
     * AuthService calls this with email + password during login.
     */
    @Bean
    public AuthenticationManager authenticationManager(
        AuthenticationConfiguration config
    ) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * PasswordEncoder — BCrypt with strength 12.
     *
     * BCrypt automatically:
     * - Generates a random salt for each password
     * - Applies the salt + hashing 2^12 = 4096 times (work factor)
     * - Stores the salt inside the hash string
     *
     * Strength 12 is the current industry recommendation:
     * - Strength 10: ~100ms per hash (too fast for brute force protection)
     * - Strength 12: ~400ms per hash (good balance)
     * - Strength 14: ~1600ms per hash (too slow for user experience)
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}