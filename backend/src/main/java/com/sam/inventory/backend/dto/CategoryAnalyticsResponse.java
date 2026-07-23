package com.sam.inventory.backend.dto;

import java.math.BigDecimal;

public record CategoryAnalyticsResponse(
        String category,
        long productCount,
        long totalQuantity,
        BigDecimal inventoryValue
) {
}
