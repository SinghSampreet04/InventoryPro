package com.sam.inventory.backend.dto;

public class AnalyticsResponse {

    private long totalProducts;
    private int totalQuantity;
    private double totalInventoryValue;
    private double averagePrice;

    public AnalyticsResponse() {
    }

    // ✅ ADD THIS CONSTRUCTOR (THIS FIXES YOUR ERROR)
    public AnalyticsResponse(long totalProducts,
                             int totalQuantity,
                             double totalInventoryValue,
                             double averagePrice) {
        this.totalProducts = totalProducts;
        this.totalQuantity = totalQuantity;
        this.totalInventoryValue = totalInventoryValue;
        this.averagePrice = averagePrice;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public int getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(int totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public double getTotalInventoryValue() {
        return totalInventoryValue;
    }

    public void setTotalInventoryValue(double totalInventoryValue) {
        this.totalInventoryValue = totalInventoryValue;
    }

    public double getAveragePrice() {
        return averagePrice;
    }

    public void setAveragePrice(double averagePrice) {
        this.averagePrice = averagePrice;
    }
}