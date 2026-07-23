package com.sam.inventory.backend.dto;

import java.math.BigDecimal;

public record AnalyticsResponse(
        long totalProducts,
        long totalQuantity,
        BigDecimal totalInventoryValue,
        BigDecimal averagePrice,
        long lowStockProducts,
        long outOfStockProducts
) {
}
