package com.algovision.application.service;

import com.algovision.infrastructure.config.JdoodleConfig;
import com.algovision.presentation.dto.request.CodeExecutionRequest;
import com.algovision.presentation.dto.response.CodeExecutionResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CodeExecutionService {

    private final JdoodleConfig jdoodleConfig;
    private final RestTemplate restTemplate;

    private static final Map<String, String[]> LANGUAGE_MAP = Map.of(
        "JAVA",       new String[]{"java",   "4"},
        "CPP",        new String[]{"cpp17",  "1"},
        "PYTHON",     new String[]{"python3","4"},
        "JAVASCRIPT", new String[]{"nodejs", "4"}
    );

    public CodeExecutionResponse execute(CodeExecutionRequest request) {
        String language = request.language().toUpperCase();
        String[] langConfig = LANGUAGE_MAP.get(language);

        if (langConfig == null) {
            return CodeExecutionResponse.error(
                "INVALID_LANGUAGE",
                "Unsupported language: " + request.language(),
                request.language()
            );
        }

        log.info("Executing {} code via JDoodle", language);

        try {
            Map<String, Object> body = new HashMap<>();
            body.put("clientId",     jdoodleConfig.getClientId());
            body.put("clientSecret", jdoodleConfig.getClientSecret());
            body.put("script",       request.sourceCode());
            body.put("language",     langConfig[0]);
            body.put("versionIndex", langConfig[1]);
            body.put("stdin",        request.stdin() != null ? request.stdin() : "");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> httpRequest = new HttpEntity<>(body, headers);

            log.info("Calling JDoodle API at: {}", jdoodleConfig.getApiUrl());

            ResponseEntity<Map> response = restTemplate.postForEntity(
                jdoodleConfig.getApiUrl(), httpRequest, Map.class
            );

            log.info("JDoodle response status: {}", response.getStatusCode());

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<?, ?> result = response.getBody();
                log.info("JDoodle response body: {}", result);

                String output     = (String) result.get("output");
                String memory     = String.valueOf(result.get("memory"));
                String cpuTime    = String.valueOf(result.get("cpuTime"));
                Integer statusCode = (Integer) result.get("statusCode");

                if (statusCode != null && statusCode == 200) {
                    return CodeExecutionResponse.success(output, cpuTime, memory, language);
                } else {
                    String status = statusCode != null && statusCode == 400
                        ? "COMPILE_ERROR" : "RUNTIME_ERROR";
                    return CodeExecutionResponse.error(status, output, language);
                }
            }

            return CodeExecutionResponse.error("API_ERROR", "Code execution service unavailable", language);

        } catch (Exception e) {
            log.error("Code execution failed: {}", e.getMessage(), e);
            return CodeExecutionResponse.error(
                "API_ERROR",
                "Code execution failed: " + e.getMessage(),
                language
            );
        }
    }
}