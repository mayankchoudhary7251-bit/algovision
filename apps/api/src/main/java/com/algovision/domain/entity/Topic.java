package com.algovision.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "topics")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 100)
    private String slug;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(nullable = false, length = 20)
    private String difficulty;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "jsonb")
    private String timeComplexity;

    @Column(length = 50)
    private String spaceComplexity;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}
