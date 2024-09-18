package com.example.demo.assets;

import com.example.demo.admin.Admin;
import com.example.demo.order.Order;
import com.example.demo.supplies.Supplies;
import jakarta.persistence.*;

import java.sql.Timestamp;
import java.util.Date;

@Entity
@Table(name = "assets")
public class Assets {

    @Id
    @Column(unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column
    private TransactionType type;

    @OneToOne(targetEntity = Order.class, mappedBy = "assets", cascade = CascadeType.MERGE)
    @JoinColumn(name = "relation_order_id", referencedColumnName = "id")
    private Order relationOrder;

    @OneToOne(targetEntity = Supplies.class, mappedBy = "assets", cascade = CascadeType.MERGE)
    @JoinColumn(name = "relation_supplies_id", referencedColumnName = "id")
    private Supplies relationSupplies;

    public enum TransactionType{
        PROFIT,
        LOSS
    }

    public Assets(){

    }

    public Assets(Order order){
        this.setType(TransactionType.PROFIT);
        this.setRelationOrder(order);
    }

    public Assets(Supplies supplies){
        this.setType(TransactionType.LOSS);
        this.setRelationSupplies(supplies);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public Order getRelationOrder() {
        return relationOrder;
    }

    public void setRelationOrder(Order relationOrder) {
        this.relationOrder = relationOrder;
    }

    public Supplies getRelationSupplies() {
        return relationSupplies;
    }

    public void setRelationSupplies(Supplies relationSupplies) {
        this.relationSupplies = relationSupplies;
    }
}
