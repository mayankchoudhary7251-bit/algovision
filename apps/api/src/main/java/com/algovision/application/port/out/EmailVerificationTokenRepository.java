package com.algovision.application.port.out;

import com.algovision.domain.entity.EmailVerificationToken;

import java.util.Optional;

/**
 * EmailVerificationTokenRepository — output port for email verification tokens.
 *
 * When a user registers, we:
 * 1. Generate a random token
 * 2. Store it here with an expiry time
 * 3. Email the user a link containing the token
 * 4. When they click the link, we look up the token here and mark their email as verified
 */
public interface EmailVerificationTokenRepository {

    EmailVerificationToken save(EmailVerificationToken token);

    Optional<EmailVerificationToken> findByToken(String token);

    void deleteByToken(String token);
}