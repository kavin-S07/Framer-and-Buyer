package com.example.farm_marketplace.controller;

import com.example.farm_marketplace.dto.ProductResponse;
import com.example.farm_marketplace.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    /**
     * Get all available products (for buyers to browse)
     * GET /api/products
     */
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String district) {
        List<ProductResponse> products = productService.getAllAvailableProducts();

        // Optional: implement filtering logic here
        // For now, return all products

        return ResponseEntity.ok(products);
    }

    /**
     * Get product details by ID
     * GET /api/products/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProduct(@PathVariable Long id) {
        ProductResponse response = productService.getProductById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Get products by farmer ID
     * GET /api/products/farmer/{farmerId}
     */
    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<ProductResponse>> getProductsByFarmer(@PathVariable Long farmerId) {
        List<ProductResponse> products = productService.getProductsByFarmerId(farmerId);
        return ResponseEntity.ok(products);
    }
}
