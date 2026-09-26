package com.algovision.presentation.controller;

import com.algovision.application.service.CodeExecutionService;
import com.algovision.presentation.dto.request.CodeExecutionRequest;
import com.algovision.presentation.dto.response.CodeExecutionResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/code")
@RequiredArgsConstructor
public class CodeController {

    private final CodeExecutionService codeExecutionService;

    @PostMapping("/run")
    public ResponseEntity<CodeExecutionResponse> runCode(
        @Valid @RequestBody CodeExecutionRequest request
    ) {
        CodeExecutionResponse response = codeExecutionService.execute(request);
        return ResponseEntity.ok(response);
    }
}