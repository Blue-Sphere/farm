package com.example.demo.assets;

import com.example.demo.admin.Admin;
import com.example.demo.order.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

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
        return assetsRepository.calculateTotalForOrders()- assetsRepository.calculateTotalForOrders();
    }

    public Integer getMonthRevenue(){
        LocalDate currentDateTime = LocalDate.now();

        LocalDate firstDayOfMonth = currentDateTime.withDayOfMonth(1);
        LocalDate lastDayOfMonth = YearMonth.from(currentDateTime).atEndOfMonth();

        LocalDateTime startOfMonth = firstDayOfMonth.atStartOfDay();
        LocalDateTime endOfMonth = lastDayOfMonth.atTime(23,59,59);
        return assetsRepository.calculateMonthRevenue(Timestamp.valueOf(startOfMonth), Timestamp.valueOf(endOfMonth));
    }

    public Integer getMonthCost(){
        LocalDate currentDateTime = LocalDate.now();

        LocalDate firstDayOfMonth = currentDateTime.withDayOfMonth(1);
        LocalDate lastDayOfMonth = YearMonth.from(currentDateTime).atEndOfMonth();

        LocalDateTime startOfMonth = firstDayOfMonth.atStartOfDay();
        LocalDateTime endOfMonth = lastDayOfMonth.atTime(23,59,59);
        return assetsRepository.calculateMonthCost(Date.valueOf(startOfMonth.toLocalDate()), Date.valueOf(endOfMonth.toLocalDate()));
    }

    public ArrayList<Integer> getAllMonthAssetsSum(){
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
