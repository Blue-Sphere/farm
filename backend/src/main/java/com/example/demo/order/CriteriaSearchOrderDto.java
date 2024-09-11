package com.example.demo.order;

import java.sql.Timestamp;

public class CriteriaSearchOrderDto {
    private Timestamp startTime;

    private Timestamp endTime;

    private String[] itemsName;

    private String[] queryOptions;

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

    public String[] getItemsName() {
        return itemsName;
    }

    public void setItemsName(String[] itemsName) {
        this.itemsName = itemsName;
    }

    public String[] getQueryOptions() {
        return queryOptions;
    }

    public void setQueryOptions(String[] queryOptions) {
        this.queryOptions = queryOptions;
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
