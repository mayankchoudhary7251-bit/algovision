package com.algovision.presentation.controller;

import com.algovision.domain.entity.User;
import com.algovision.infrastructure.persistence.JpaUserProgressRepository;
import com.algovision.infrastructure.persistence.JpaTopicRepository;
import com.algovision.domain.entity.UserProgress;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final JpaUserProgressRepository progressRepository;
    private final JpaTopicRepository topicRepository;

    @GetMapping
    public ResponseEntity<List<UserProgress>> getProgress(
        @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(progressRepository.findByUserId(user.getId()));
    }

    @PutMapping("/{topicSlug}")
    public ResponseEntity<Map<String, String>> updateProgress(
        @AuthenticationPrincipal User user,
        @PathVariable String topicSlug,
        @RequestBody Map<String, String> body
    ) {
        String status = body.get("status");
        topicRepository.findBySlug(topicSlug).ifPresent(topic -> {
            UserProgress progress = progressRepository
                .findByUserIdAndTopicId(user.getId(), topic.getId())
                .orElse(UserProgress.builder().user(user).topic(topic).build());
            progress.setStatus(status);
            progressRepository.save(progress);
        });
        return ResponseEntity.ok(Map.of("message", "Progress updated"));
    }
}