package com.example.demo.assets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

@RestController
@RequestMapping(path = "/assets")
public class AssetsController {

    @Autowired
    AssetsService assetsService;

    @PostMapping(path = "/get")
    public Iterable<Assets> getAll(){
        return assetsService.getAll();
    }

    @PostMapping(path = "/add")
    public String add(@RequestBody Assets assets){
        assetsService.addNewAssetsLog(assets);
        return "記錄成功";
    }

    @PostMapping(path = "/get_sum")
    public Integer getSum(){
        return assetsService.getSum();
    }

    @PostMapping(path = "/month_revenue")
    public Integer getMonthRevenue(){
        return assetsService.getMonthRevenue();
    }

    @PostMapping(path = "/month_cost")
    public Integer getMonthCost(){
        return assetsService.getMonthCost();
    }

    @PostMapping(path = "/month_all_assets_sum")
    public ArrayList<Integer> getMonthAllAssetsSum(){
        return assetsService.getAllMonthAssetsSum();
    }

}
