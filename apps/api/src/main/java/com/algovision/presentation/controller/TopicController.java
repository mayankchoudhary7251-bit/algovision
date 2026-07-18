package com.algovision.presentation.controller;

import com.algovision.domain.entity.Topic;
import com.algovision.infrastructure.persistence.JpaTopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/topics")
@RequiredArgsConstructor
public class TopicController {

    private final JpaTopicRepository topicRepository;

    @GetMapping
    public ResponseEntity<List<Topic>> getAllTopics(
        @RequestParam(required = false) String category
    ) {
        if (category != null) {
            return ResponseEntity.ok(topicRepository.findByCategory(category.toUpperCase()));
        }
        return ResponseEntity.ok(topicRepository.findAll());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Topic> getTopicBySlug(@PathVariable String slug) {
        return topicRepository.findBySlug(slug)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}