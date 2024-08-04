package com.example.demo.cart;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends CrudRepository<CartItem, Long> {
    List<Optional<CartItem>> findByBuyersEmail(String email);

    Optional<CartItem> findByProductId(Integer productId);
}
