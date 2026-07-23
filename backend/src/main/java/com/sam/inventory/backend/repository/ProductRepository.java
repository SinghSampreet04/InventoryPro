package com.sam.inventory.backend.repository;

import com.sam.inventory.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findAllByOrderByUpdatedAtDesc();

    List<Product> findByQuantityLessThanEqualOrderByQuantityAsc(int quantity);

    Optional<Product> findBySkuIgnoreCase(String sku);
}
