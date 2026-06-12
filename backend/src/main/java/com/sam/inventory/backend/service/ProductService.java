package com.sam.inventory.backend.service;

import com.sam.inventory.backend.entity.Product;
import com.sam.inventory.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    // GET ALL
    public List<Product> getAllProducts() {
        return repository.findAll();
    }

    // ADD
    public Product addProduct(Product product) {
        return repository.save(product);
    }

    // UPDATE (SAFE + CLEAN)
    public Product updateProduct(Long id, Product updatedProduct) {
        return repository.findById(id)
                .map(product -> {
                    product.setName(updatedProduct.getName());
                    product.setSku(updatedProduct.getSku());
                    product.setQuantity(updatedProduct.getQuantity());
                    product.setPrice(updatedProduct.getPrice());
                    product.setCategory(updatedProduct.getCategory());
                    return repository.save(product);
                })
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    // DELETE
    public void deleteProduct(Long id) {
        repository.deleteById(id);
    }

    // LOW STOCK (DATABASE OPTIMIZED VERSION WILL REQUIRE REPOSITORY METHOD)
    public List<Product> getLowStockProducts() {
        return repository.findByQuantityLessThan(5);
    }
}