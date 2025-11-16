package com.example.farm_marketplace.dto;


import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderRequest {
    @NotNull(message = "Farmer ID is required")
    private Long farmerId;

    @NotEmpty(message = "Order must contain at least one item")
    private List<OrderItemRequest> items;

    @Data
    public static class OrderItemRequest {
        @NotNull(message = "Product ID is required")
        private Long productId;

        @NotNull(message = "Quantity is required")
        @DecimalMin(value = "0.1", message = "Quantity must be at least 0.1")
        private BigDecimal quantity;
    }
}
