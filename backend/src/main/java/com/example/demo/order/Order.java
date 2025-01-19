package com.example.demo.order;

import com.example.demo.View;
import com.example.demo.assets.Assets;
import com.example.demo.user.User;
import com.fasterxml.jackson.annotation.JsonView;
import jakarta.persistence.*;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "`Order`")
public class Order {
    @Id
    @Column(unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView({View.OrderInfo.class})
    private Long id;

    @OneToOne(targetEntity = Assets.class, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "relation_assets_id", referencedColumnName = "id")
    private Assets assets;

    @JsonView({View.OrderInfo.class})
    @Temporal(TemporalType.TIMESTAMP)
    private Timestamp creationTime;

    @JsonView({View.OrderInfo.class})
    @ManyToOne
    @JoinColumn(name="user_id", referencedColumnName = "id")
    private User boughtByUser;

    @JsonView({View.OrderInfo.class})
    @OneToMany(mappedBy="order", cascade=CascadeType.ALL , orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    @JsonView({View.OrderInfo.class})
    @Column
    private String status;

    @JsonView({View.OrderInfo.class})
    @Column
    private Integer total;

    @PrePersist
    public void setCreationTime(){
        Timestamp currentTimestamp = new Timestamp((new Date().getTime()));
        currentTimestamp.setNanos(0);
        this.setCreationTime(currentTimestamp);
    }

    public void addOrderItem(OrderItem orderItem) {
        orderItems.add(orderItem);
        orderItem.setOrder(this);
    }

    public void removeOrderItem(OrderItem orderItem) {
        orderItems.remove(orderItem);
        orderItem.setOrder(null);
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

    public Timestamp getCreationTime() {
        return creationTime;
    }

    public void setCreationTime(Timestamp creationTime) {
        this.creationTime = creationTime;
    }

    public User getBoughtByUser() {
        return boughtByUser;
    }

    public void setBoughtByUser(User boughtByUser) {
        this.boughtByUser = boughtByUser;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }
}
