package com.sam.inventory.backend.service;

import com.sam.inventory.backend.dto.AnalyticsResponse;
import com.sam.inventory.backend.entity.Product;
import com.sam.inventory.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnalyticsService {

    private final ProductRepository repository;

    public AnalyticsService(ProductRepository repository) {
        this.repository = repository;
    }

    // MAIN ANALYTICS (REAL DB DATA)
    public AnalyticsResponse getAnalytics() {

        List<Product> products = repository.findAll();

        long totalProducts = products.size();

        int totalQuantity = products.stream()
                .mapToInt(Product::getQuantity)
                .sum();

        double totalInventoryValue = products.stream()
                .mapToDouble(p -> p.getPrice() * p.getQuantity())
                .sum();

        double averagePrice = products.isEmpty()
                ? 0
                : products.stream()
                .mapToDouble(Product::getPrice)
                .average()
                .orElse(0);

        return new AnalyticsResponse(
                totalProducts,
                totalQuantity,
                totalInventoryValue,
                averagePrice
        );
    }

    // 📈 GROWTH CHART DATA (REAL BASED + SIMULATED TREND)
    public List<Double> getRevenueHistory() {

        List<Product> products = repository.findAll();

        double totalRevenue = products.stream()
                .mapToDouble(p -> p.getPrice() * p.getQuantity())
                .sum();

        return List.of(
                totalRevenue * 0.5,
                totalRevenue * 0.6,
                totalRevenue * 0.7,
                totalRevenue * 0.8,
                totalRevenue * 0.9,
                totalRevenue
        );
    }
}