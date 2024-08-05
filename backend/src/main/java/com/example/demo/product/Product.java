package com.example.demo.product;

import com.example.demo.View;
import com.example.demo.admin.Admin;
import com.fasterxml.jackson.annotation.JsonView;
import jakarta.persistence.*;

@Entity
@Table(name = "Product")
public class Product {
    @Id
    @Column(unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer Id;

    @JsonView(View.ProductName.class)
    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private Integer price;

    @Column(nullable = false)
    private Integer quantity;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] image;

    @Column
    private String description;

    @ManyToOne(targetEntity = Admin.class, cascade = CascadeType.ALL)
    @JoinColumn(name = "added_admin_id", referencedColumnName = "id")
    private Admin addedByAdmin;

    @Column
    private boolean isAvailable;

    public Integer getId() {
        return Id;
    }

    public void setId(Integer id) {
        Id = id;
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

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) {
        isAvailable = available;
    }

    public Admin getAddedByAdmin() {
        return addedByAdmin;
    }

    public void setAddedByAdmin(Admin addedByAdmin) {
        this.addedByAdmin = addedByAdmin;
    }

    public Product(){

    }

    public Product(Integer id, String name, int price, int quantity, byte[] image){
        this.Id = id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.image = image;
    }
}

