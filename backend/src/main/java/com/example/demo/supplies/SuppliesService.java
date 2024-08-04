package com.example.demo.supplies;

import com.example.demo.assets.Assets;
import com.example.demo.assets.AssetsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class SuppliesService {
    @Autowired
    SuppliesRepository suppliesRepository;

    @Autowired
    AssetsRepository assetsRepository;

    public ResponseEntity buyNewSupplies(Supplies supplies){
        Assets assets = new Assets(supplies);
        assetsRepository.save(assets);
        suppliesRepository.save(supplies);
        return ResponseEntity.ok().body("成功新增物品");
    }
}
