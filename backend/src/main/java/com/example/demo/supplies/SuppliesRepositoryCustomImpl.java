package com.example.demo.supplies;

import com.example.demo.supplies.Supplies;
import com.example.demo.supplies.SuppliesRepositoryCustom;
import com.example.demo.supplies.CriteriaSearchSuppliesDto;
import com.example.demo.order.Order;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class SuppliesRepositoryCustomImpl implements SuppliesRepositoryCustom{
    @PersistenceContext
    private EntityManager entityManager;

    public List<Supplies> findSuppliesByCriteria(CriteriaSearchSuppliesDto criteriaSearchSuppliesDto) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Supplies> query = cb.createQuery(Supplies.class);
        Root<Supplies> supplies = query.from(Supplies.class);

        List<Predicate> predicates = new ArrayList<>();

        if (criteriaSearchSuppliesDto.getStartTime() != null) {
            predicates.add(cb.greaterThanOrEqualTo(supplies.get("purchaseTime"), criteriaSearchSuppliesDto.getStartTime()));
        }

        if (criteriaSearchSuppliesDto.getEndTime() != null) {
            predicates.add(cb.lessThanOrEqualTo(supplies.get("purchaseTime"), criteriaSearchSuppliesDto.getEndTime()));
        }

        if (criteriaSearchSuppliesDto.getQueryOptions() != null) {
            List<Predicate> statusPredicates = new ArrayList<>();
            for(Supplies.SuppliesType option:  criteriaSearchSuppliesDto.getQueryOptions()) {
                statusPredicates.add(cb.equal(supplies.get("queryOptions"), option.toString()));
            }
            predicates.add(cb.or(statusPredicates.toArray(new Predicate[0])));
        }

        if(criteriaSearchSuppliesDto.getAmountCompare() != null && criteriaSearchSuppliesDto.getAmountValue() != null){
            switch (criteriaSearchSuppliesDto.getAmountCompare()){
                case MORE_THAN:
                    predicates.add(cb.greaterThan(supplies.get("total"), criteriaSearchSuppliesDto.getAmountValue()));
                    break;
                case LESS_THAN:
                    predicates.add(cb.lessThan(supplies.get("total"), criteriaSearchSuppliesDto.getAmountValue()));
                    break;
                case EQUALS:
                    predicates.add(cb.equal(supplies.get("total"), criteriaSearchSuppliesDto.getAmountValue()));
                    break;
            }
        }


        query.where(predicates.toArray(new Predicate[0]));

        return entityManager.createQuery(query).getResultList();
    }
}

