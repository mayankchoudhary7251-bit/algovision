package com.algovision.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_progress",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "topic_id"}))
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class UserProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    @Column(nullable = false)
    @Builder.Default
    private String status = "NOT_STARTED";

    private Instant completedAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;
}