package com.sam.inventory.backend.controller;

import com.sam.inventory.backend.dto.AnalyticsResponse;
import com.sam.inventory.backend.dto.CategoryAnalyticsResponse;
import com.sam.inventory.backend.service.AnalyticsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping
    public AnalyticsResponse getAnalytics() {
        return analyticsService.getAnalytics();
    }

    @GetMapping("/categories")
    public List<CategoryAnalyticsResponse> getCategoryAnalytics() {
        return analyticsService.getCategoryAnalytics();
    }
}
