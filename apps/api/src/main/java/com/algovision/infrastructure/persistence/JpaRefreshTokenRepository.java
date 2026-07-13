package com.algovision.infrastructure.persistence;

import com.algovision.application.port.out.RefreshTokenRepository;
import com.algovision.domain.entity.RefreshToken;
import com.algovision.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

/**
 * JpaRefreshTokenRepository — Infrastructure implementation of RefreshTokenRepository.
 *
 * @Modifying + @Transactional are required for UPDATE and DELETE queries.
 * @Query lets us write custom JPQL when Spring Data cannot infer the query from the method name.
 */
@Repository
public interface JpaRefreshTokenRepository extends JpaRepository<RefreshToken, UUID>, RefreshTokenRepository {

    Optional<RefreshToken> findByToken(String token);

    void deleteAllByUser(User user);

    @Modifying
    @Transactional
    @Query("UPDATE RefreshToken r SET r.revoked = true WHERE r.token = :token")
    void revokeToken(String token);
}