package com.example.demo.supplies;

import java.util.List;

public interface SuppliesRepositoryCustom {
    List<Supplies> findSuppliesByCriteria(CriteriaSearchSuppliesDto criteriaSearchSuppliesDto);
}
