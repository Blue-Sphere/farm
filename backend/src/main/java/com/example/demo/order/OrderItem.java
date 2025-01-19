package com.example.demo.order;

import com.example.demo.View;
import com.example.demo.product.Product;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonView;
import jakarta.persistence.*;

@Entity
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id", referencedColumnName = "id")
    @JsonBackReference // 解決循環依賴
    private Order order;

    @JsonView({View.OrderInfo.class})
    @ManyToOne(targetEntity = Product.class, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private Product product;

    @Column(nullable = false)
    @JsonView({View.OrderInfo.class})
    private int quantity;

    @Column(nullable = false)
    @JsonView({View.OrderInfo.class})
    private int price;

    @Column
    @JsonView({View.OrderInfo.class})
    private int total;

    @PrePersist
    @PreUpdate
    public void calculateTotal(){
        this.total = quantity*price;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order_id) {
        this.order = order_id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }
}
