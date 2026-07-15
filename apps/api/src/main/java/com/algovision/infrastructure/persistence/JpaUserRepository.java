package com.algovision.infrastructure.persistence;

import com.algovision.application.port.out.UserRepository;
import com.algovision.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * JpaUserRepository — Infrastructure implementation of UserRepository port.
 *
 * Spring Data JPA generates SQL queries from method names automatically:
 * findByEmail(String email) → SELECT * FROM users WHERE email = ?
 * existsByUsername(String username) → SELECT COUNT(*) FROM users WHERE username = ?
 *
 * This class is in the Infrastructure layer — the Application layer
 * only knows about the UserRepository interface, not this class.
 * Spring's dependency injection wires this implementation in at runtime.
 */
@Repository
public interface JpaUserRepository extends JpaRepository<User, UUID>, UserRepository {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);
}