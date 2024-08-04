package com.example.demo.order;

import java.sql.Timestamp;

public class CriteriaSearchOrderDto {
    private Timestamp startTime;

    private Timestamp endTime;

    private String[] orderItemsName;

    private String[] statusChosen;

    private String amountCompare;

    private String amountValue;


    public Timestamp getStartTime() {
        return startTime;
    }

    public void setStartTime(Timestamp startTime) {
        this.startTime = startTime;
    }

    public Timestamp getEndTime() {
        return endTime;
    }

    public void setEndTime(Timestamp endTime) {
        this.endTime = endTime;
    }

    public String[] getOrderItemsName() {
        return orderItemsName;
    }

    public void setOrderItemsName(String[] orderItemsName) {
        this.orderItemsName = orderItemsName;
    }

    public String[] getStatusChosen() {
        return statusChosen;
    }

    public void setStatusChosen(String[] statusChosen) {
        this.statusChosen = statusChosen;
    }

    public String getAmountCompare() {
        return amountCompare;
    }

    public void setAmountCompare(String amountCompare) {
        this.amountCompare = amountCompare;
    }

    public String getAmountValue() {
        return amountValue;
    }

    public void setAmountValue(String amountValue) {
        this.amountValue = amountValue;
    }
}
