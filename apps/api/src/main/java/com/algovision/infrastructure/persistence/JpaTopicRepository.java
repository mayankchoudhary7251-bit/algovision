package com.algovision.infrastructure.persistence;

import com.algovision.domain.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JpaTopicRepository extends JpaRepository<Topic, UUID> {
    Optional<Topic> findBySlug(String slug);
    List<Topic> findByCategory(String category);
}