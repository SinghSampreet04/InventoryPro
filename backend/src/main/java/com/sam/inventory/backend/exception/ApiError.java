package com.sam.inventory.backend.exception;

import java.time.Instant;
import java.util.Map;

public record ApiError(
        Instant timestamp,
        int status,
        String message,
        Map<String, String> fieldErrors
) {
    public ApiError(int status, String message) {
        this(Instant.now(), status, message, Map.of());
    }
}
