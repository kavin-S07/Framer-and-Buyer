package com.example.farm_marketplace.controller;

import com.example.farm_marketplace.dto.OrderResponse;
import com.example.farm_marketplace.dto.ProductRequest;
import com.example.farm_marketplace.dto.ProductResponse;
import com.example.farm_marketplace.service.FileStorageService;
import com.example.farm_marketplace.service.OrderService;
import com.example.farm_marketplace.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/farmer")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FarmerController {

    private final ProductService productService;
    private final OrderService orderService;
    private final FileStorageService fileStorageService;

    /**
     * Create a new product
     * POST /api/farmer/products
     */
    @PostMapping("/products")
    public ResponseEntity<ProductResponse> createProduct(
            Authentication authentication,
            @Valid @RequestBody ProductRequest request) {
        String email = authentication.getName();
        ProductResponse response = productService.createProduct(email, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all products for logged-in farmer
     * GET /api/farmer/products
     */
    @GetMapping("/products")
    public ResponseEntity<List<ProductResponse>> getMyProducts(Authentication authentication) {
        String email = authentication.getName();
        List<ProductResponse> products = productService.getFarmerProducts(email);
        return ResponseEntity.ok(products);
    }

    /**
     * Get specific product by ID (farmer's own product)
     * GET /api/farmer/products/{id}
     */
    @GetMapping("/products/{id}")
    public ResponseEntity<ProductResponse> getProductById(
            Authentication authentication,
            @PathVariable Long id) {
        String email = authentication.getName();
        ProductResponse response = productService.getFarmerProductById(email, id);
        return ResponseEntity.ok(response);
    }

    /**
     * Update product
     * PUT /api/farmer/products/{id}
     */
    @PutMapping("/products/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        String email = authentication.getName();
        ProductResponse response = productService.updateProduct(email, id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete product
     * DELETE /api/farmer/products/{id}
     */
    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(
            Authentication authentication,
            @PathVariable Long id) {
        String email = authentication.getName();
        productService.deleteProduct(email, id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Upload product image
     * POST /api/farmer/products/{id}/image
     */
    @PostMapping("/products/{id}/image")
    public ResponseEntity<ProductResponse> uploadProductImage(
            Authentication authentication,
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        String email = authentication.getName();
        String imageUrl = fileStorageService.storeFile(file);
        ProductResponse response = productService.updateProductImage(email, id, imageUrl);
        return ResponseEntity.ok(response);
    }

    /**
     * Toggle product active/inactive status
     * PATCH /api/farmer/products/{id}/toggle
     */
    @PatchMapping("/products/{id}/toggle")
    public ResponseEntity<ProductResponse> toggleProductStatus(
            Authentication authentication,
            @PathVariable Long id) {
        String email = authentication.getName();
        ProductResponse response = productService.toggleProductStatus(email, id);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all orders received by farmer
     * GET /api/farmer/orders
     */
    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getReceivedOrders(
            Authentication authentication,
            @RequestParam(required = false) String status) {
        String email = authentication.getName();
        List<OrderResponse> orders = orderService.getFarmerOrders(email, status);
        return ResponseEntity.ok(orders);
    }

    /**
     * Get order details by ID
     * GET /api/farmer/orders/{id}
     */
    @GetMapping("/orders/{id}")
    public ResponseEntity<OrderResponse> getOrderById(
            Authentication authentication,
            @PathVariable Long id) {
        String email = authentication.getName();
        OrderResponse response = orderService.getOrderById(email, id);
        return ResponseEntity.ok(response);
    }

    /**
     * Confirm an order
     * PUT /api/farmer/orders/{id}/confirm
     */
    @PutMapping("/orders/{id}/confirm")
    public ResponseEntity<OrderResponse> confirmOrder(
            Authentication authentication,
            @PathVariable Long id) {
        String email = authentication.getName();
        OrderResponse response = orderService.confirmOrder(email, id);
        return ResponseEntity.ok(response);
    }

    /**
     * Reject an order
     * PUT /api/farmer/orders/{id}/reject
     */
    @PutMapping("/orders/{id}/reject")
    public ResponseEntity<OrderResponse> rejectOrder(
            Authentication authentication,
            @PathVariable Long id) {
        String email = authentication.getName();
        OrderResponse response = orderService.rejectOrder(email, id);
        return ResponseEntity.ok(response);
    }

    /**
     * Complete an order
     * PUT /api/farmer/orders/{id}/complete
     */
    @PutMapping("/orders/{id}/complete")
    public ResponseEntity<OrderResponse> completeOrder(
            Authentication authentication,
            @PathVariable Long id) {
        String email = authentication.getName();
        OrderResponse response = orderService.completeOrder(email, id);
        return ResponseEntity.ok(response);
    }

    /**
     * Get sales history (completed orders)
     * GET /api/farmer/sales-history
     */
    @GetMapping("/sales-history")
    public ResponseEntity<List<OrderResponse>> getSalesHistory(Authentication authentication) {
        String email = authentication.getName();
        List<OrderResponse> orders = orderService.getFarmerOrders(email, "COMPLETED");
        return ResponseEntity.ok(orders);
    }

    /**
     * Get farmer dashboard statistics
     * GET /api/farmer/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats(Authentication authentication) {
        String email = authentication.getName();
        Map<String, Object> stats = orderService.getFarmerStats(email);
        return ResponseEntity.ok(stats);
    }
}