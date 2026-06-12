package com.sam.inventory.backend.controller;

import com.sam.inventory.backend.dto.AnalyticsResponse;
import com.sam.inventory.backend.service.AnalyticsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/analytics")
@CrossOrigin("*")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    // REAL DASHBOARD ANALYTICS
    @GetMapping
    public AnalyticsResponse getAnalytics() {
        return analyticsService.getAnalytics();
    }

    // CHART DATA (REVENUE HISTORY)
    @GetMapping("/history")
    public List<Double> getHistory() {
        return analyticsService.getRevenueHistory();
    }
}