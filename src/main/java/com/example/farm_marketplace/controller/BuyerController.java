package com.example.farm_marketplace.controller;

import com.example.farm_marketplace.dto.OrderRequest;
import com.example.farm_marketplace.dto.OrderResponse;
import com.example.farm_marketplace.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/buyer")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BuyerController {

    private final OrderService orderService;

    /**
     * Create a new order
     * POST /api/buyer/orders
     */
    @PostMapping("/orders")
    public ResponseEntity<OrderResponse> createOrder(
            Authentication authentication,
            @Valid @RequestBody OrderRequest request) {
        String email = authentication.getName();
        OrderResponse response = orderService.createOrder(email, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all orders placed by buyer
     * GET /api/buyer/orders
     */
    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getMyOrders(
            Authentication authentication,
            @RequestParam(required = false) String status) {
        String email = authentication.getName();
        List<OrderResponse> orders = orderService.getBuyerOrders(email, status);
        return ResponseEntity.ok(orders);
    }

    /**
     * Get order details by ID
     * GET /api/buyer/orders/{id}
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
     * Cancel a pending order
     * PUT /api/buyer/orders/{id}/cancel
     */
    @PutMapping("/orders/{id}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            Authentication authentication,
            @PathVariable Long id) {
        String email = authentication.getName();
        OrderResponse response = orderService.cancelOrder(email, id);
        return ResponseEntity.ok(response);
    }

    /**
     * Get order history (all past orders)
     * GET /api/buyer/order-history
     */
    @GetMapping("/order-history")
    public ResponseEntity<List<OrderResponse>> getOrderHistory(Authentication authentication) {
        String email = authentication.getName();
        List<OrderResponse> orders = orderService.getBuyerOrders(email, null);
        return ResponseEntity.ok(orders);
    }

    /**
     * Get pending orders
     * GET /api/buyer/orders/pending
     */
    @GetMapping("/orders/pending")
    public ResponseEntity<List<OrderResponse>> getPendingOrders(Authentication authentication) {
        String email = authentication.getName();
        List<OrderResponse> orders = orderService.getBuyerOrders(email, "PENDING");
        return ResponseEntity.ok(orders);
    }

    /**
     * Get buyer dashboard statistics
     * GET /api/buyer/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats(Authentication authentication) {
        String email = authentication.getName();
        Map<String, Object> stats = orderService.getBuyerStats(email);
        return ResponseEntity.ok(stats);
    }
}
