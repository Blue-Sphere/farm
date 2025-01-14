package com.example.demo.user;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.stereotype.Component;

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

        if (criteriaSearchUserDto.getQueryOptions() != null) {
            List<Predicate> statusPredicates = new ArrayList<>();
            for(boolean option:  criteriaSearchUserDto.getQueryOptions()) {
                statusPredicates.add(cb.equal(user.get("isAvailable"), option));
            }
            predicates.add(cb.or(statusPredicates.toArray(new Predicate[0])));
        }

        query.where(predicates.toArray(new Predicate[0]));

        return entityManager.createQuery(query).getResultList();
    }
}
