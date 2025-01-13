package com.example.demo.assets;

import com.example.demo.View;
import com.example.demo.order.CriteriaSearchOrderDto;
import com.example.demo.order.Order;
import com.example.demo.security.AuthenticationSecurity;
import com.fasterxml.jackson.annotation.JsonView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "/assets")
@CrossOrigin( origins = "*")
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

    @PostMapping(path = "/years_monthly_summary/{year}")
    private ResponseEntity getYearsMonthlySummary(@PathVariable int year, @RequestParam boolean splitIncomeAndExpense){
        List<Map<String, Object>> result = assetsService.getYearsMonthlySummary(year, splitIncomeAndExpense);

        return ResponseEntity.ok().body(result);
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

@ControllerAdvice(basePackageClasses = AssetsController.class)
class HeaderValidatorAdvice {
    @Autowired
    AuthenticationSecurity authenticationSecurity;

    @ModelAttribute
    public void validateHeaders(@RequestHeader("Authorization") String authorization) {
        // 驗證或處理標頭
        if (!authorization.startsWith("Bearer ")) {
            throw new IllegalStateException("Invalid Authorization Header");
        }

        String token = authorization.replace("Bearer ", "");
        if(!authenticationSecurity.validateAdminsToken(token))
            throw new IllegalStateException("不被接受的token");
    }
}
