package com.algovision.infrastructure.persistence;

import com.algovision.application.port.out.EmailVerificationTokenRepository;
import com.algovision.domain.entity.EmailVerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * JpaEmailVerificationRepository — Infrastructure implementation.
 */
@Repository
public interface JpaEmailVerificationRepository
        extends JpaRepository<EmailVerificationToken, UUID>, EmailVerificationTokenRepository {

    Optional<EmailVerificationToken> findByToken(String token);

    void deleteByToken(String token);
}