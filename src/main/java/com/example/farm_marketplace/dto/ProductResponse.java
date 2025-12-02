package com.example.farm_marketplace.dto;


import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class ProductResponse {
    private Long id;
    private Long farmerId;
    private String farmerName;
    private String farmerState;
    private String farmerDistrict;
    private String farmerPhone;
    private String name;
    private String description;
    private BigDecimal price;
    private String unit;
    private BigDecimal qtyAvailable;
    private String imageUrl;
    private Boolean active;
    private LocalDateTime createdAt;
}
