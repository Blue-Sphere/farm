package com.example.demo.product;

import com.example.demo.supplies.Supplies;

import java.sql.Date;

public class CriteriaSearchProductDto {


    private boolean queryOptions[];

    private AmountCompare amountCompare;

    private String amountValue;
    
    public enum AmountCompare{
        MORE_THAN,
        LESS_THAN,
        EQUALS
    }

    public String[] itemsName;

    public boolean[] getQueryOptions() {
        return queryOptions;
    }

    public void setQueryOptions(boolean[] queryOptions) {
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

    public String[] getItemsName() {
        return itemsName;
    }

    public void setItemsName(String[] itemsName) {
        this.itemsName = itemsName;
    }
}
