package com.algovision.domain.entity;

import com.algovision.domain.valueobject.Role;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

/**
 * User — the central domain entity.
 *
 * Annotations explained:
 * @Entity       — tells JPA this class maps to a database table
 * @Table        — specifies the exact table name in PostgreSQL
 * @Getter       — Lombok generates getters for all fields
 * @Setter       — Lombok generates setters for all fields
 * @Builder      — Lombok generates a builder pattern: User.builder().email("x").build()
 * @NoArgsConstructor — Lombok generates empty constructor (required by JPA)
 * @AllArgsConstructor — Lombok generates constructor with all fields (required by @Builder)
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    /**
     * Never store plain text passwords.
     * This field stores the BCrypt hash — e.g. "$2a$10$..."
     * BCrypt is a one-way hash — you cannot reverse it to get the password.
     * To verify: BCryptPasswordEncoder.matches(rawPassword, hashedPassword)
     */
    @Column(nullable = false)
    private String passwordHash;

    /**
     * @Enumerated(STRING) — stores "USER" or "ADMIN" as text in DB.
     * Without this annotation, JPA stores the ordinal (0 or 1) which
     * breaks if you ever reorder the enum values.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private Role role = Role.USER;

    @Column(nullable = false, length = 10)
    @Builder.Default
    private String themePref = "dark";

    /**
     * Email verification — users must verify their email before
     * they can access protected features.
     * Default false — set to true when they click the verification link.
     */
    @Column(nullable = false)
    @Builder.Default
    private boolean emailVerified = false;

    /**
     * @CreationTimestamp — Hibernate automatically sets this to
     * the current timestamp when the entity is first saved.
     * updatable = false — this value never changes after creation.
     */
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;
}