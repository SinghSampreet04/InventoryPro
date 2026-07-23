package com.sam.inventory.backend.service;

import com.sam.inventory.backend.entity.Product;
import com.sam.inventory.backend.exception.ConflictException;
import com.sam.inventory.backend.exception.ResourceNotFoundException;
import com.sam.inventory.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Product> getAllProducts() {
        return repository.findAllByOrderByUpdatedAtDesc();
    }

    @Transactional
    public Product addProduct(Product product) {
        normalize(product);
        repository.findBySkuIgnoreCase(product.getSku()).ifPresent(existing -> {
            throw new ConflictException("A product with this SKU already exists");
        });
        return repository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, Product updatedProduct) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        normalize(updatedProduct);
        repository.findBySkuIgnoreCase(updatedProduct.getSku())
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new ConflictException("A product with this SKU already exists");
                });

        product.setName(updatedProduct.getName());
        product.setSku(updatedProduct.getSku());
        product.setQuantity(updatedProduct.getQuantity());
        product.setPrice(updatedProduct.getPrice());
        product.setCategory(updatedProduct.getCategory());
        return repository.save(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found");
        }
        repository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Product> getLowStockProducts() {
        return repository.findByQuantityLessThanEqualOrderByQuantityAsc(5);
    }

    private void normalize(Product product) {
        product.setName(product.getName().trim());
        product.setSku(product.getSku().trim().toUpperCase(Locale.ROOT));
        product.setCategory(product.getCategory().trim());
    }
}
