package com.example.demo.order;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface OrderRepositoryCustom{
    List<Order> findOrdersByCriteria(CriteriaSearchOrderDto criteriaSearchOrderDto);
}
