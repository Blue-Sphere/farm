package com.example.demo.supplies;

import java.sql.Date;

public class CriteriaSearchSuppliesDto {
    private Date startTime;

    private Date endTime;

    private Supplies.SuppliesType queryOptions[];

    private AmountCompare amountCompare;

    private String amountValue;
    
    public enum AmountCompare{
        MORE_THAN,
        LESS_THAN,
        EQUALS
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public Supplies.SuppliesType[] getQueryOptions() {
        return queryOptions;
    }

    public void setQueryOptions(Supplies.SuppliesType[] queryOptions) {
        this.queryOptions = queryOptions;
    }

    public AmountCompare getAmountCompare() {
        return amountCompare;
    }

    public void setAmountCompare(AmountCompare amountCompare) {
        this.amountCompare = amountCompare;
    }

    public String getAmountValue() {
        return amountValue;
    }

    public void setAmountValue(String amountValue) {
        this.amountValue = amountValue;
    }
}
