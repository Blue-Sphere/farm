package com.example.demo;

public interface View {
    public class UserBasicInfo{}

    public class ProductName{}

    public class OrderInfo extends ProductName{}

    public class UserOrders extends OrderInfo{}

    public class AdminCheckOrders extends OrderInfo{}
}
