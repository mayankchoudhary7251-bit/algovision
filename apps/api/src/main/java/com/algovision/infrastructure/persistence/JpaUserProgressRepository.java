package com.algovision.infrastructure.persistence;

import com.algovision.domain.entity.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JpaUserProgressRepository extends JpaRepository<UserProgress, UUID> {
    List<UserProgress> findByUserId(UUID userId);
    Optional<UserProgress> findByUserIdAndTopicId(UUID userId, UUID topicId);
    long countByUserIdAndStatus(UUID userId, String status);
}