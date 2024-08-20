package com.example.demo.user;

import com.example.demo.order.Order;
import com.example.demo.supplies.Supplies;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Component
public class UserRepositoryCustomImpl implements UserRepositoryCustom {
    @PersistenceContext
    private EntityManager entityManager;

    public List<User> findUserByCriteria(CriteriaSearchUserDto criteriaSearchUserDto) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<User> query = cb.createQuery(User.class);
        Root<User> user = query.from(User.class);

        List<Predicate> predicates = new ArrayList<>();

        if (criteriaSearchUserDto.getQueryOptionsForIsAvailable() != null) {
            List<Predicate> statusPredicates = new ArrayList<>();
            for(boolean option:  criteriaSearchUserDto.getQueryOptionsForIsAvailable()) {
                statusPredicates.add(cb.equal(user.get("isAvailable"), option));
            }
            predicates.add(cb.or(statusPredicates.toArray(new Predicate[0])));
        }

        query.where(predicates.toArray(new Predicate[0]));

        return entityManager.createQuery(query).getResultList();
    }
}
