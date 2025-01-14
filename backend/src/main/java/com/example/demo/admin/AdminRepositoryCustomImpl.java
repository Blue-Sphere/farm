package com.example.demo.admin;

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
public class AdminRepositoryCustomImpl implements AdminRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    public List<Admin> findAdminByCriteria(CriteriaSearchAdminDto criteriaSearchAdminDto) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Admin> query = cb.createQuery(Admin.class);
        Root<Admin> admin = query.from(Admin.class);

        List<Predicate> predicates = new ArrayList<>();

        if (criteriaSearchAdminDto.getQueryOptions() != null) {
            List<Predicate> statusPredicates = new ArrayList<>();
            for(boolean option:  criteriaSearchAdminDto.getQueryOptions()) {

                statusPredicates.add(cb.equal(admin.get("isAvailable"), option));
            }
            predicates.add(cb.or(statusPredicates.toArray(new Predicate[0])));
        }

        query.where(predicates.toArray(new Predicate[0]));

        return entityManager.createQuery(query).getResultList();
    }
}
