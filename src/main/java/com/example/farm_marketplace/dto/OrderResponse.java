package com.example.farm_marketplace.dto;


import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponse {
    private Long id;
    private Long buyerId;
    private String buyerName;
    private String buyerPhone;
    private String buyerAddress;
    private Long farmerId;
    private String farmerName;
    private String status;
    private BigDecimal totalAmount;
    private List<OrderItemResponse> items;
    private LocalDateTime createdAt;

    @Data
    @Builder
    public static class OrderItemResponse {
        private Long id;
        private Long productId;
        private String productName;
        private BigDecimal quantity;
        private BigDecimal priceEach;
        private BigDecimal subtotal;
    }
}