package com.example.demo.assets;

import com.example.demo.admin.Admin;
import com.example.demo.order.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AssetsService {

    @Autowired
    AssetsRepository assetsRepository;

    public Iterable<Assets> getAll(){
        return assetsRepository.findAll();
    }

    public void addNewAssetsLog(Assets assets){
        assetsRepository.save(assets);
    }

    public void addOrderAssetsLog(Order order, Admin admin){
        Assets assets = new Assets();
        assets.setRelationOrder(order);

        assetsRepository.save(assets);
    }

    public Integer getSum(){
        return assetsRepository.calculateTotalForOrders()- assetsRepository.calculateTotalForSupplies();
    }

    public Integer getProfitSum(){
        return assetsRepository.calculateTotalForOrders();
    }

    public Integer getLossSum(){
        return assetsRepository.calculateTotalForSupplies();
    }

    public Integer getMonthlyRevenue(){
        LocalDate currentDateTime = LocalDate.now();

        LocalDate firstDayOfMonth = currentDateTime.withDayOfMonth(1);
        LocalDate lastDayOfMonth = YearMonth.from(currentDateTime).atEndOfMonth();

        LocalDateTime startOfMonth = firstDayOfMonth.atStartOfDay();
        LocalDateTime endOfMonth = lastDayOfMonth.atTime(23,59,59);
        return assetsRepository.calculateMonthRevenue(Timestamp.valueOf(startOfMonth), Timestamp.valueOf(endOfMonth));
    }

    public Integer getMonthlyCost(){
        LocalDate currentDateTime = LocalDate.now();

        LocalDate firstDayOfMonth = currentDateTime.withDayOfMonth(1);
        LocalDate lastDayOfMonth = YearMonth.from(currentDateTime).atEndOfMonth();

        LocalDateTime startOfMonth = firstDayOfMonth.atStartOfDay();
        LocalDateTime endOfMonth = lastDayOfMonth.atTime(23,59,59);
        return assetsRepository.calculateMonthCost(Date.valueOf(startOfMonth.toLocalDate()), Date.valueOf(endOfMonth.toLocalDate()));
    }

    public List<Map<String, Object>> getYearsMonthlySummary(int year, boolean splitIncomeAndExpense){

        List<Map<String, Object>> result = new ArrayList<>();

        Map<String, Integer> yearsMonthRevenue = new HashMap<>();
        Map<String, Integer> yearsMonthCost = new HashMap<>();

        for(int month=1; month<=12; month++) {
            YearMonth yearMonth = YearMonth.of(year, month);

            LocalDate firstDayOfMonth = yearMonth.atDay(1);
            LocalDate lastDayOfMonth = yearMonth.atEndOfMonth();

            LocalDateTime startOfMonth = firstDayOfMonth.atStartOfDay();
            LocalDateTime endOfMonth = lastDayOfMonth.atTime(23, 59, 59);

            Integer monthRevenue = assetsRepository.calculateMonthRevenue(Timestamp.valueOf(startOfMonth), Timestamp.valueOf(endOfMonth));
            Integer monthCost = assetsRepository.calculateMonthCost(Date.valueOf(startOfMonth.toLocalDate()), Date.valueOf(endOfMonth.toLocalDate()));

            yearsMonthRevenue.put(Integer.toString(month), monthRevenue);
            yearsMonthCost.put(Integer.toString(month), monthCost);

            Map<String, Object> monthData = new HashMap<>();
            if (splitIncomeAndExpense) {
                monthData.put("month", month);
                monthData.put("revenue", monthRevenue);
                monthData.put("cost", monthCost);
                result.add(monthData);
                continue;
            }

            monthData.put("month", month);
            monthData.put("total", monthRevenue- monthCost);
            result.add(monthData);

        }
        return result;
    }

    public ArrayList<Integer> getAllMonthlyAssetsSum(){
        LocalDate currentDate = LocalDate.now();
        ArrayList<Integer> allMonthAssetsSum = new ArrayList<>();
        for(int i=1; i<=12; i++){
            YearMonth yearMonth = YearMonth.of(currentDate.getYear(), i);

            LocalDateTime startTimeOfMonth = yearMonth.atDay(1).atStartOfDay();
            LocalDateTime endTimeOfMonth = yearMonth.atEndOfMonth().atTime(23, 59, 59);

            allMonthAssetsSum.add(assetsRepository.calculateMonthRevenue(Timestamp.valueOf(startTimeOfMonth), Timestamp.valueOf(endTimeOfMonth))- assetsRepository.calculateMonthCost(Date.valueOf(startTimeOfMonth.toLocalDate()) , Date.valueOf(endTimeOfMonth.toLocalDate())));
        }

        return allMonthAssetsSum;
    }

    public List<Assets> getCriteriaSearchAssets(CriteriaSearchAssetsDto criteriaSearchAssetsDto) {
        return assetsRepository.findAssetsByCriteria(criteriaSearchAssetsDto);
    }
}
