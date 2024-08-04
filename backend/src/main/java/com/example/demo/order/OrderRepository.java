package com.example.demo.order;

import com.example.demo.user.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends CrudRepository<Order, Long>, OrderRepositoryCustom{

    Optional<Order> findById(Integer id);

    List<Order> findByBoughtByUser(User user);

    @Query("SELECT o FROM Order o WHERE o.status = :status")
    List<Order> findSpecifyStatusOrder(@Param("status") String status);

    @Query("SELECT o.status, COUNT(o) FROM Order o GROUP BY o.status")
    List<Object[]> countOrdersByStatus();
}