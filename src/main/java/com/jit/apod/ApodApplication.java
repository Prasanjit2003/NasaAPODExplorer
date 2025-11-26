package com.jit.apod;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the Spring Boot application.
 * This starts the embedded Tomcat server on port 8080.
 */
@SpringBootApplication
public class ApodApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApodApplication.class, args);
    }
}