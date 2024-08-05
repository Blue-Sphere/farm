package com.example.demo.product;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

import java.util.ArrayList;
import java.util.List;

public class ProductRepositoryCustomImpl implements ProductRepositoryCustom {
    @PersistenceContext
    private EntityManager entityManager;

    public List<Product> findProductByCriteria(CriteriaSearchProductDto criteriaSearchProductDto) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Product> query = cb.createQuery(Product.class);
        Root<Product> product = query.from(Product.class);

        List<Predicate> predicates = new ArrayList<>();

        if (criteriaSearchProductDto.getQueryOptions() != null) {
            List<Predicate> statusPredicates = new ArrayList<>();
            for(boolean option:  criteriaSearchProductDto.getQueryOptions()) {
                statusPredicates.add(cb.equal(product.get("queryOptions"), option));
            }
            predicates.add(cb.or(statusPredicates.toArray(new Predicate[0])));
        }

        if(criteriaSearchProductDto.getAmountCompare() != null && criteriaSearchProductDto.getAmountValue() != null){
            switch (criteriaSearchProductDto.getAmountCompare()){
                case MORE_THAN:
                    predicates.add(cb.greaterThan(product.get("total"), criteriaSearchProductDto.getAmountValue()));
                    break;
                case LESS_THAN:
                    predicates.add(cb.lessThan(product.get("total"), criteriaSearchProductDto.getAmountValue()));
                    break;
                case EQUALS:
                    predicates.add(cb.equal(product.get("total"), criteriaSearchProductDto.getAmountValue()));
                    break;
            }
        }

        if (criteriaSearchProductDto.getItemsName() != null) {
            predicates.add(cb.equal(product.get("name"), criteriaSearchProductDto.getItemsName()));
        }

        query.where(predicates.toArray(new Predicate[0]));

        return entityManager.createQuery(query).getResultList();
    }
}

