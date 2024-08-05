package com.example.demo.product;

import com.example.demo.supplies.Supplies;

import java.util.List;

public interface ProductRepositoryCustom {
    List<Product> findProductByCriteria(CriteriaSearchProductDto criteriaSearchSuppliesDto);
}
