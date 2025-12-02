package com.example.farm_marketplace.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductRequest {
    @NotBlank(message = "Product name is required")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal price;

    private String unit = "kg";

    @NotNull(message = "Quantity is required")
    @DecimalMin(value = "0.0", message = "Quantity cannot be negative")
    private BigDecimal qtyAvailable;
}