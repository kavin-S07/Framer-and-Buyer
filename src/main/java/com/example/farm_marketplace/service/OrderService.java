package com.example.farm_marketplace.service;

import com.example.farm_marketplace.dto.OrderRequest;
import com.example.farm_marketplace.dto.OrderResponse;
import com.example.farm_marketplace.entity.Order;
import com.example.farm_marketplace.entity.OrderItem;
import com.example.farm_marketplace.entity.Product;
import com.example.farm_marketplace.entity.User;
import com.example.farm_marketplace.exception.InsufficientStockException;
import com.example.farm_marketplace.exception.ResourceNotFoundException;
import com.example.farm_marketplace.repository.OrderRepository;
import com.example.farm_marketplace.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserService userService;

    /**
     * Create a new order (Buyer only)
     */
    @Transactional
    public OrderResponse createOrder(String buyerEmail, OrderRequest request) {
        User buyer = userService.findByEmail(buyerEmail);

        if (!"BUYER".equals(buyer.getRole())) {
            throw new RuntimeException("Only buyers can create orders");
        }

        User farmer = userService.findById(request.getFarmerId());

        if (!"FARMER".equals(farmer.getRole())) {
            throw new RuntimeException("Invalid farmer ID");
        }

        Order order = Order.builder()
                .buyer(buyer)
                .farmer(farmer)
                .status(Order.OrderStatus.PENDING)
                .totalAmount(BigDecimal.ZERO)
                .items(new ArrayList<>())
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderRequest.OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

            if (!product.getFarmer().getId().equals(farmer.getId())) {
                throw new RuntimeException("All products must be from the same farmer");
            }

            if (!product.getActive()) {
                throw new RuntimeException("Product " + product.getName() + " is not active");
            }

            if (product.getQtyAvailable().compareTo(itemRequest.getQuantity()) < 0) {
                throw new InsufficientStockException(
                        "Insufficient stock for " + product.getName() +
                                ". Available: " + product.getQtyAvailable() + " " + product.getUnit()
                );
            }

            // Deduct quantity using optimistic locking
            product.setQtyAvailable(product.getQtyAvailable().subtract(itemRequest.getQuantity()));
            productRepository.save(product);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemRequest.getQuantity())
                    .priceEach(product.getPrice())
                    .build();

            order.getItems().add(orderItem);

            BigDecimal itemTotal = product.getPrice().multiply(itemRequest.getQuantity());
            totalAmount = totalAmount.add(itemTotal);
        }

        order.setTotalAmount(totalAmount);
        order = orderRepository.save(order);

        return mapToResponse(order);
    }

    /**
     * Get buyer orders with optional status filter - UPDATED METHOD!
     */
    public List<OrderResponse> getBuyerOrders(String buyerEmail, String status) {
        User buyer = userService.findByEmail(buyerEmail);

        List<Order> orders;
        if (status != null && !status.isBlank()) {
            try {
                Order.OrderStatus orderStatus = Order.OrderStatus.valueOf(status.toUpperCase());
                orders = orderRepository.findByBuyerIdAndStatus(buyer.getId(), orderStatus);
            } catch (IllegalArgumentException e) {
                // Invalid status, return all orders
                orders = orderRepository.findByBuyerId(buyer.getId());
            }
        } else {
            orders = orderRepository.findByBuyerId(buyer.getId());
        }

        return orders.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get farmer orders with optional status filter - UPDATED METHOD!
     */
    public List<OrderResponse> getFarmerOrders(String farmerEmail, String status) {
        User farmer = userService.findByEmail(farmerEmail);

        List<Order> orders;
        if (status != null && !status.isBlank()) {
            try {
                Order.OrderStatus orderStatus = Order.OrderStatus.valueOf(status.toUpperCase());
                orders = orderRepository.findByFarmerIdAndStatus(farmer.getId(), orderStatus);
            } catch (IllegalArgumentException e) {
                // Invalid status, return all orders
                orders = orderRepository.findByFarmerId(farmer.getId());
            }
        } else {
            orders = orderRepository.findByFarmerId(farmer.getId());
        }

        return orders.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get order by ID with access control
     */
    public OrderResponse getOrderById(String userEmail, Long orderId) {
        User user = userService.findByEmail(userEmail);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getBuyer().getId().equals(user.getId()) &&
                !order.getFarmer().getId().equals(user.getId())) {
            throw new RuntimeException("You don't have access to this order");
        }

        return mapToResponse(order);
    }

    /**
     * Confirm order (Farmer only)
     */
    @Transactional
    public OrderResponse confirmOrder(String farmerEmail, Long orderId) {
        User farmer = userService.findByEmail(farmerEmail);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getFarmer().getId().equals(farmer.getId())) {
            throw new RuntimeException("You can only confirm your own orders");
        }

        if (order.getStatus() != Order.OrderStatus.PENDING) {
            throw new RuntimeException("Only pending orders can be confirmed");
        }

        order.setStatus(Order.OrderStatus.CONFIRMED);
        order = orderRepository.save(order);

        return mapToResponse(order);
    }

    /**
     * Reject order (Farmer only)
     */
    @Transactional
    public OrderResponse rejectOrder(String farmerEmail, Long orderId) {
        User farmer = userService.findByEmail(farmerEmail);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getFarmer().getId().equals(farmer.getId())) {
            throw new RuntimeException("You can only reject your own orders");
        }

        if (order.getStatus() != Order.OrderStatus.PENDING) {
            throw new RuntimeException("Only pending orders can be rejected");
        }

        // Return stock
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setQtyAvailable(product.getQtyAvailable().add(item.getQuantity()));
            productRepository.save(product);
        }

        order.setStatus(Order.OrderStatus.REJECTED);
        order = orderRepository.save(order);

        return mapToResponse(order);
    }

    /**
     * Complete order (Farmer only) - NEW METHOD!
     */
    @Transactional
    public OrderResponse completeOrder(String farmerEmail, Long orderId) {
        User farmer = userService.findByEmail(farmerEmail);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getFarmer().getId().equals(farmer.getId())) {
            throw new RuntimeException("You can only complete your own orders");
        }

        if (order.getStatus() != Order.OrderStatus.CONFIRMED) {
            throw new RuntimeException("Only confirmed orders can be completed");
        }

        order.setStatus(Order.OrderStatus.COMPLETED);
        order = orderRepository.save(order);

        return mapToResponse(order);
    }

    /**
     * Cancel order (Buyer only)
     */
    @Transactional
    public OrderResponse cancelOrder(String buyerEmail, Long orderId) {
        User buyer = userService.findByEmail(buyerEmail);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getBuyer().getId().equals(buyer.getId())) {
            throw new RuntimeException("You can only cancel your own orders");
        }

        if (order.getStatus() != Order.OrderStatus.PENDING) {
            throw new RuntimeException("Only pending orders can be cancelled");
        }

        // Return stock
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setQtyAvailable(product.getQtyAvailable().add(item.getQuantity()));
            productRepository.save(product);
        }

        order.setStatus(Order.OrderStatus.CANCELLED);
        order = orderRepository.save(order);

        return mapToResponse(order);
    }

    /**
     * Get farmer dashboard statistics - NEW METHOD!
     */
    public Map<String, Object> getFarmerStats(String farmerEmail) {
        User farmer = userService.findByEmail(farmerEmail);
        List<Order> allOrders = orderRepository.findByFarmerId(farmer.getId());

        Map<String, Object> stats = new HashMap<>();

        // Count orders by status
        long pendingCount = allOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.PENDING)
                .count();
        long confirmedCount = allOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.CONFIRMED)
                .count();
        long completedCount = allOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.COMPLETED)
                .count();
        long rejectedCount = allOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.REJECTED)
                .count();

        // Calculate total revenue (completed orders only)
        BigDecimal totalRevenue = allOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.COMPLETED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate pending revenue
        BigDecimal pendingRevenue = allOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.PENDING ||
                        o.getStatus() == Order.OrderStatus.CONFIRMED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        stats.put("totalOrders", allOrders.size());
        stats.put("pendingOrders", pendingCount);
        stats.put("confirmedOrders", confirmedCount);
        stats.put("completedOrders", completedCount);
        stats.put("rejectedOrders", rejectedCount);
        stats.put("totalRevenue", totalRevenue);
        stats.put("pendingRevenue", pendingRevenue);

        // Get product count
        List<Product> products = productRepository.findByFarmerId(farmer.getId());
        stats.put("totalProducts", products.size());
        stats.put("activeProducts", products.stream().filter(Product::getActive).count());

        return stats;
    }

    /**
     * Get buyer dashboard statistics - NEW METHOD!
     */
    public Map<String, Object> getBuyerStats(String buyerEmail) {
        User buyer = userService.findByEmail(buyerEmail);
        List<Order> allOrders = orderRepository.findByBuyerId(buyer.getId());

        Map<String, Object> stats = new HashMap<>();

        // Count orders by status
        long pendingCount = allOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.PENDING)
                .count();
        long confirmedCount = allOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.CONFIRMED)
                .count();
        long completedCount = allOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.COMPLETED)
                .count();
        long cancelledCount = allOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.CANCELLED)
                .count();

        // Calculate total spent (completed orders only)
        BigDecimal totalSpent = allOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.COMPLETED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate pending amount
        BigDecimal pendingAmount = allOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.PENDING ||
                        o.getStatus() == Order.OrderStatus.CONFIRMED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        stats.put("totalOrders", allOrders.size());
        stats.put("pendingOrders", pendingCount);
        stats.put("confirmedOrders", confirmedCount);
        stats.put("completedOrders", completedCount);
        stats.put("cancelledOrders", cancelledCount);
        stats.put("totalSpent", totalSpent);
        stats.put("pendingAmount", pendingAmount);

        return stats;
    }

    /**
     * Map Order entity to OrderResponse DTO
     */
    private OrderResponse mapToResponse(Order order) {
        List<OrderResponse.OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> OrderResponse.OrderItemResponse.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .quantity(item.getQuantity())
                        .priceEach(item.getPriceEach())
                        .subtotal(item.getPriceEach().multiply(item.getQuantity()))
                        .build())
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .buyerId(order.getBuyer().getId())
                .buyerName(order.getBuyer().getName())
                .buyerPhone(order.getBuyer().getPhone())
                .buyerAddress(order.getBuyer().getAddress())
                .farmerId(order.getFarmer().getId())
                .farmerName(order.getFarmer().getName())
                .status(order.getStatus().name())
                .totalAmount(order.getTotalAmount())
                .items(itemResponses)
                .createdAt(order.getCreatedAt())
                .build();
    }
}