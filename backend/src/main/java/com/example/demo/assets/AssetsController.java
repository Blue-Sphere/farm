package com.example.demo.assets;

import com.example.demo.security.AuthenticationSecurity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

//    @PostMapping(path = "/get_sum")
//    public Integer getSum(){
//        return assetsService.getSum();
//    }

    @PostMapping(path = "/monthly_total")
    public Integer getMonthlyTotal(){
        return assetsService.getMonthlyRevenue()-assetsService.getMonthlyCost();
    }

    @PostMapping(path = "/monthly_revenue")
    public Integer getMonthRevenue(){
        return assetsService.getMonthlyRevenue();
    }

    @PostMapping(path = "/monthly_cost")
    public Integer getMonthlyCost(){
        return assetsService.getMonthlyCost();
    }

    @PostMapping(path = "/years_monthly_summary/{year}")
    private ResponseEntity getYearsMonthlySummary(@PathVariable int year, @RequestParam boolean splitIncomeAndExpense){
        List<Map<String, Object>> result = assetsService.getYearsMonthlySummary(year, splitIncomeAndExpense);

        return ResponseEntity.ok().body(result);
    }

    @PostMapping(path = "/month_all_assets_sum")
    public Integer getAllAssetsSum(){
        return assetsService.getSum();
    }
    @PostMapping(path = "/month_all_profit_sum")
    public Integer getAllProfitSum(){
        return assetsService.getProfitSum();
    }
    @PostMapping(path = "/month_all_loss_sum")
    public Integer getAllLossSum(){
        return assetsService.getLossSum();
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
