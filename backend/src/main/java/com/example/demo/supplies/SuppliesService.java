package com.example.demo.supplies;

import com.example.demo.assets.Assets;
import com.example.demo.assets.AssetsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SuppliesService {
    @Autowired
    SuppliesRepository suppliesRepository;

    @Autowired
    AssetsRepository assetsRepository;

    public ResponseEntity getAllSupplies(){
        Iterable<Supplies> allSupplies = suppliesRepository.findAll();
        return ResponseEntity.ok().body(allSupplies);
    }

    public ResponseEntity buyNewSupplies(Supplies supplies){
        Assets assets = new Assets(supplies);
        supplies.setAssets(assets);

        suppliesRepository.save(supplies);

        return ResponseEntity.ok().body("成功新增物品");
    }

    public ResponseEntity removeSupplies(Long suppliesId){
        suppliesRepository.deleteById(suppliesId);
        return ResponseEntity.ok().body("成功刪除購買紀錄："+suppliesId);
    }

    public List<Supplies> getCriteriaSearchSupplies(CriteriaSearchSuppliesDto criteriaSearchSuppliesDto) {
        return suppliesRepository.findSuppliesByCriteria(criteriaSearchSuppliesDto);
    }
}
