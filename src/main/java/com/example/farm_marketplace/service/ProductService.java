package com.example.farm_marketplace.service;
import com.example.farm_marketplace.dto.ProductRequest;
import com.example.farm_marketplace.dto.ProductResponse;
import com.example.farm_marketplace.entity.Product;
import com.example.farm_marketplace.entity.User;
import com.example.farm_marketplace.exception.ResourceNotFoundException;
import com.example.farm_marketplace.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {
    private final ProductRepository productRepository;
    private final UserService userService;

    /**
     * Create a new product (Farmer only)
     */
    @Transactional
    public ProductResponse createProduct(String farmerEmail, ProductRequest request) {
        User farmer = userService.findByEmail(farmerEmail);

        if (!"FARMER".equals(farmer.getRole())) {
            throw new RuntimeException("Only farmers can create products");
        }

        Product product = Product.builder()
                .farmer(farmer)
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .unit(request.getUnit())
                .qtyAvailable(request.getQtyAvailable())
                .active(true)
                .build();

        product = productRepository.save(product);
        return mapToResponse(product);
    }

    /**
     * Get all products created by logged-in farmer
     */
    public List<ProductResponse> getFarmerProducts(String farmerEmail) {
        User farmer = userService.findByEmail(farmerEmail);
        return productRepository.findByFarmerId(farmer.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get products by farmer ID - MISSING METHOD!
     */
    public List<ProductResponse> getProductsByFarmerId(Long farmerId) {
        // Verify farmer exists
        userService.findById(farmerId);

        return productRepository.findByFarmerId(farmerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get all available products (active and in stock)
     */
    public List<ProductResponse> getAllAvailableProducts() {
        return productRepository.findAvailableProducts()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get product by ID (public access)
     */
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return mapToResponse(product);
    }

    /**
     * Get farmer's own product by ID - MISSING METHOD!
     */
    public ProductResponse getFarmerProductById(String farmerEmail, Long productId) {
        User farmer = userService.findByEmail(farmerEmail);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!product.getFarmer().getId().equals(farmer.getId())) {
            throw new RuntimeException("You can only view your own products");
        }

        return mapToResponse(product);
    }

    /**
     * Update product details
     */
    @Transactional
    public ProductResponse updateProduct(String farmerEmail, Long productId, ProductRequest request) {
        User farmer = userService.findByEmail(farmerEmail);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!product.getFarmer().getId().equals(farmer.getId())) {
            throw new RuntimeException("You can only update your own products");
        }

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setUnit(request.getUnit());
        product.setQtyAvailable(request.getQtyAvailable());

        product = productRepository.save(product);
        return mapToResponse(product);
    }

    /**
     * Delete product
     */
    @Transactional
    public void deleteProduct(String farmerEmail, Long productId) {
        User farmer = userService.findByEmail(farmerEmail);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!product.getFarmer().getId().equals(farmer.getId())) {
            throw new RuntimeException("You can only delete your own products");
        }

        productRepository.delete(product);
    }

    /**
     * Update product image
     */
    @Transactional
    public ProductResponse updateProductImage(String farmerEmail, Long productId, String imageUrl) {
        User farmer = userService.findByEmail(farmerEmail);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!product.getFarmer().getId().equals(farmer.getId())) {
            throw new RuntimeException("You can only update your own products");
        }

        product.setImageUrl(imageUrl);
        product = productRepository.save(product);
        return mapToResponse(product);
    }

    /**
     * Toggle product active/inactive status - MISSING METHOD!
     */
    @Transactional
    public ProductResponse toggleProductStatus(String farmerEmail, Long productId) {
        User farmer = userService.findByEmail(farmerEmail);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!product.getFarmer().getId().equals(farmer.getId())) {
            throw new RuntimeException("You can only update your own products");
        }

        // Toggle the active status
        product.setActive(!product.getActive());
        product = productRepository.save(product);

        return mapToResponse(product);
    }

    /**
     * Get product entity by ID (for internal use)
     */
    public Product getProductEntityById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    /**
     * Map Product entity to ProductResponse DTO
     */
    private ProductResponse mapToResponse(Product product) {
        User farmer = product.getFarmer();
        return ProductResponse.builder()
                .id(product.getId())
                .farmerId(farmer.getId())
                .farmerName(farmer.getName())
                .farmerState(farmer.getState())
                .farmerDistrict(farmer.getDistrict())
                .farmerPhone(farmer.getPhone())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .unit(product.getUnit())
                .qtyAvailable(product.getQtyAvailable())
                .imageUrl(product.getImageUrl())
                .active(product.getActive())
                .createdAt(product.getCreatedAt())
                .build();
    }
}