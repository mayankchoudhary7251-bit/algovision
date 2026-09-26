package com.algovision.infrastructure.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "jdoodle")
@Getter
@Setter
public class JdoodleConfig {
    private String clientId;
    private String clientSecret;
    private String apiUrl;
    private int timeoutSeconds;
}