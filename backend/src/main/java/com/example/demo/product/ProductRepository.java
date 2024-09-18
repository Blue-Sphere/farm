package com.example.demo.product;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends CrudRepository<Product, Integer>, ProductRepositoryCustom {

    Optional<Product> findByName(String name);

    Optional<Product> findById(Integer Id);

    @Query("SELECT NEW Product(p.Id, p.name, p.price, p.quantity, p.image) FROM Product p WHERE p.quantity != 0")
    List<Product> findAllInventory();

    @Query("SELECT NEW Product(p.Id, p.name, p.price, p.quantity, p.image) FROM Product p WHERE p.quantity != 0 AND p.id = :id")
    Optional<Product> findInventoryById(Integer id);

}
