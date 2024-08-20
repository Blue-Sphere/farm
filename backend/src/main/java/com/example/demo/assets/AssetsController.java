package com.example.demo.assets;

import com.example.demo.View;
import com.example.demo.order.CriteriaSearchOrderDto;
import com.example.demo.order.Order;
import com.fasterxml.jackson.annotation.JsonView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

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

    @PostMapping(path = "/criteria_search")
    private ResponseEntity getOrdersByCriteria(@RequestBody CriteriaSearchAssetsDto criteriaSearchAssetsDto){
        List<Assets> result = assetsService.getCriteriaSearchAssets(criteriaSearchAssetsDto);

        return ResponseEntity.ok().body(result);
    }

}
