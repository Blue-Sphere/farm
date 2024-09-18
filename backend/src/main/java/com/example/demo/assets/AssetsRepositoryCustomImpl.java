package com.example.demo.assets;

import com.example.demo.order.Order;
import com.example.demo.order.OrderItem;
import com.example.demo.product.Product;
import com.example.demo.supplies.Supplies;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Component
public class AssetsRepositoryCustomImpl implements AssetsRepositoryCustom{
    @PersistenceContext
    private EntityManager entityManager;

    public List<Assets> findAssetsByCriteria(CriteriaSearchAssetsDto criteriaSearchAssetsDto) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Assets> query = cb.createQuery(Assets.class);
        Root<Assets> assets = query.from(Assets.class);

        Join<Assets, Order> orderJoin = assets.join("relationOrder", JoinType.LEFT);
        Join<Assets, Supplies> suppliesJoin = assets.join("relationSupplies", JoinType.LEFT);

        List<Predicate> predicates = new ArrayList<>();

        if (criteriaSearchAssetsDto.getStartTime() != null) {
            predicates.add(cb.greaterThanOrEqualTo(orderJoin.get("creationTime"), new Timestamp(criteriaSearchAssetsDto.getStartTime().getTime())));
            predicates.add(cb.greaterThanOrEqualTo(suppliesJoin.get("purchaseTime"), criteriaSearchAssetsDto.getStartTime()));
        }

        if (criteriaSearchAssetsDto.getEndTime() != null) {
            predicates.add(cb.lessThanOrEqualTo(orderJoin.get("creationTime"), new Timestamp(criteriaSearchAssetsDto.getEndTime().getTime())));
            predicates.add(cb.lessThanOrEqualTo(suppliesJoin.get("purchaseTime"), criteriaSearchAssetsDto.getEndTime()));
        }

        if (criteriaSearchAssetsDto.getQueryOptions() != null) {
            List<Predicate> statusPredicates = new ArrayList<>();
            for(Assets.TransactionType option:  criteriaSearchAssetsDto.getQueryOptions()) {
                statusPredicates.add(cb.equal(assets.get("type"), option.toString()));
            }
            predicates.add(cb.or(statusPredicates.toArray(new Predicate[0])));
        }

        if(criteriaSearchAssetsDto.getAmountCompare() != null && criteriaSearchAssetsDto.getAmountValue() != null){
            switch (criteriaSearchAssetsDto.getAmountCompare()){
                case MORE_THAN:
                    predicates.add(cb.greaterThan(orderJoin.get("total"), criteriaSearchAssetsDto.getAmountValue()));
                    predicates.add(cb.greaterThan(suppliesJoin.get("total"), criteriaSearchAssetsDto.getAmountValue()));
                    break;
                case LESS_THAN:
                    predicates.add(cb.lessThan(orderJoin.get("total"), criteriaSearchAssetsDto.getAmountValue()));
                    predicates.add(cb.lessThan(suppliesJoin.get("total"), criteriaSearchAssetsDto.getAmountValue()));
                    break;
                case EQUALS:
                    predicates.add(cb.equal(orderJoin.get("total"), criteriaSearchAssetsDto.getAmountValue()));
                    predicates.add(cb.equal(suppliesJoin.get("total"), criteriaSearchAssetsDto.getAmountValue()));
                    break;
            }
        }

        query.where(cb.or(predicates.toArray(new Predicate[0])));

        return entityManager.createQuery(query).getResultList();
    }
}
