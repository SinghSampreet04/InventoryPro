package com.sam.inventory.backend.service;

import com.sam.inventory.backend.dto.AnalyticsResponse;
import com.sam.inventory.backend.dto.CategoryAnalyticsResponse;
import com.sam.inventory.backend.entity.Product;
import com.sam.inventory.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final ProductRepository repository;

    public AnalyticsService(ProductRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public AnalyticsResponse getAnalytics() {
        List<Product> products = repository.findAll();
        long totalProducts = products.size();
        long totalQuantity = products.stream()
                .mapToLong(Product::getQuantity)
                .sum();
        BigDecimal totalInventoryValue = products.stream()
                .map(this::inventoryValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal averagePrice = products.isEmpty()
                ? BigDecimal.ZERO
                : products.stream()
                        .map(Product::getPrice)
                        .reduce(BigDecimal.ZERO, BigDecimal::add)
                        .divide(BigDecimal.valueOf(products.size()), 2, RoundingMode.HALF_UP);
        long lowStockProducts = products.stream()
                .filter(product -> product.getQuantity() > 0 && product.getQuantity() <= 5)
                .count();
        long outOfStockProducts = products.stream()
                .filter(product -> product.getQuantity() == 0)
                .count();

        return new AnalyticsResponse(
                totalProducts,
                totalQuantity,
                totalInventoryValue.setScale(2, RoundingMode.HALF_UP),
                averagePrice,
                lowStockProducts,
                outOfStockProducts
        );
    }

    @Transactional(readOnly = true)
    public List<CategoryAnalyticsResponse> getCategoryAnalytics() {
        List<Product> products = repository.findAll();
        Map<String, List<Product>> byCategory = products.stream()
                .collect(Collectors.groupingBy(
                        Product::getCategory,
                        LinkedHashMap::new,
                        Collectors.toList()
                ));

        return byCategory.entrySet().stream()
                .map(entry -> new CategoryAnalyticsResponse(
                        entry.getKey(),
                        entry.getValue().size(),
                        entry.getValue().stream().mapToLong(Product::getQuantity).sum(),
                        entry.getValue().stream()
                                .map(this::inventoryValue)
                                .reduce(BigDecimal.ZERO, BigDecimal::add)
                                .setScale(2, RoundingMode.HALF_UP)
                ))
                .sorted(Comparator.comparing(CategoryAnalyticsResponse::inventoryValue).reversed())
                .toList();
    }

    private BigDecimal inventoryValue(Product product) {
        return product.getPrice().multiply(BigDecimal.valueOf(product.getQuantity()));
    }
}
