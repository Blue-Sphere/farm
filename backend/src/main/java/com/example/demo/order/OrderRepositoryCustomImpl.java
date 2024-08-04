package com.example.demo.order;

import com.example.demo.product.Product;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class OrderRepositoryCustomImpl implements OrderRepositoryCustom {
    @PersistenceContext
    private EntityManager entityManager;

    public List<Order> findOrdersByCriteria(CriteriaSearchOrderDto criteriaSearchOrderDto) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Order> query = cb.createQuery(Order.class);
        Root<Order> order = query.from(Order.class);

        Join<Order, OrderItem> orderItemJoin = order.join("orderItems");
        Join<OrderItem, Product> productJoin = orderItemJoin.join("product");

        List<Predicate> predicates = new ArrayList<>();

        if (criteriaSearchOrderDto.getStartTime() != null) {
            predicates.add(cb.greaterThanOrEqualTo(order.get("creationTime"), criteriaSearchOrderDto.getStartTime()));
        }

        if (criteriaSearchOrderDto.getEndTime() != null) {
            predicates.add(cb.lessThanOrEqualTo(order.get("creationTime"), criteriaSearchOrderDto.getEndTime()));
        }

        if (criteriaSearchOrderDto.getStatusChosen() != null) {
            List<Predicate> statusPredicates = new ArrayList<>();
            for(String status: criteriaSearchOrderDto.getStatusChosen()) {
                statusPredicates.add(cb.equal(order.get("status"), status));
            }
            predicates.add(cb.or(statusPredicates.toArray(new Predicate[0])));
        }

        if(criteriaSearchOrderDto.getAmountCompare() != null && criteriaSearchOrderDto.getAmountValue() != null){
            switch (criteriaSearchOrderDto.getAmountCompare()){
                case "大於":
                    predicates.add(cb.greaterThan(order.get("total"), criteriaSearchOrderDto.getAmountValue()));
                    break;
                case "小於":
                    predicates.add(cb.lessThan(order.get("total"), criteriaSearchOrderDto.getAmountValue()));
                    break;
                case "等於":
                    predicates.add(cb.equal(order.get("total"), criteriaSearchOrderDto.getAmountValue()));
                    break;
            }
        }

        if (criteriaSearchOrderDto.getOrderItemsName() != null) {
            List<Predicate> productNamePredicates = new ArrayList<>();
            for (String itemName : criteriaSearchOrderDto.getOrderItemsName()) {
                productNamePredicates.add(cb.equal(productJoin.get("name"), itemName));
            }
                predicates.add(cb.or(productNamePredicates.toArray(new Predicate[0])));
        }

        query.where(predicates.toArray(new Predicate[0]));

        return entityManager.createQuery(query).getResultList();
    }
}
