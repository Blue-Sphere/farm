package com.example.demo.assets;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@Repository
public interface AssetsRepository extends CrudRepository<Assets, Long> {

    @Query("SELECT SUM(a.relationOrder.total) FROM Assets a")
    Integer calculateTotalForOrders();

    @Query("SELECT SUM(a.relationSupplies.total) FROM Assets a")
    Integer calculateTotalForSupplies();

    @Query("SELECT SUM(a.relationOrder.total) FROM Assets a WHERE a.relationOrder.creationTime BETWEEN :startTime AND :endTime AND a.relationOrder.total > 0")
    Integer calculateMonthRevenue(@Param("startTime") Timestamp startTime, @Param("endTime") Timestamp endTime);

    @Query("SELECT SUM(a.relationSupplies.total) FROM Assets a WHERE a.relationSupplies.purchaseTime BETWEEN :startTime AND :endTime AND a.relationSupplies.total > 0")
    Integer calculateMonthCost(@Param("startTime") Date startTime, @Param("endTime") Date endTime);
}
