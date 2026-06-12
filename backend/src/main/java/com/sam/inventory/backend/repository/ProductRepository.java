package com.sam.inventory.backend.repository;

import com.sam.inventory.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // LOW STOCK QUERY (DB LEVEL — PRODUCTION READY)
    List<Product> findByQuantityLessThan(int quantity);
}