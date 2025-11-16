package com.example.farm_marketplace.repository;

import com.example.farm_marketplace.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByBuyerId(Long buyerId);
    List<Order> findByFarmerId(Long farmerId);
    List<Order> findByBuyerIdAndStatus(Long buyerId, Order.OrderStatus status);
    List<Order> findByFarmerIdAndStatus(Long farmerId, Order.OrderStatus status);
}
