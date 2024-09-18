package com.example.demo.supplies;

import com.example.demo.assets.Assets;
import com.example.demo.order.Order;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.sql.Date;

@Entity
@Table(name = "supplies")
public class Supplies {

    @Id
    @Column(unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @OneToOne(targetEntity = Assets.class, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "relation_assets_id", referencedColumnName = "id")
    private Assets assets;

    @Column
    private Date purchaseTime;

    @Enumerated(EnumType.STRING)
    @Column
    private SuppliesType type;

    @Column
    private String name;

    @Column
    private Integer price;

    @Column
    private Integer quantity;

    @Column
    private Integer total;

    @PrePersist
    @PreUpdate
    public void calculateTotal(){
        this.total = quantity*price;
    }

    public enum SuppliesType{
        TOOL,
        CONSUMABLE
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Assets getAssets() {
        return assets;
    }

    public void setAssets(Assets assets) {
        this.assets = assets;
    }

    public Date getPurchaseTime() {
        return purchaseTime;
    }

    public void setPurchaseTime(Date purchaseTime) {
        this.purchaseTime = purchaseTime;
    }

    public SuppliesType getType() {
        return type;
    }

    public void setType(SuppliesType type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }
}
