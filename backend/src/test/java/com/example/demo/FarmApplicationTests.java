package com.example.demo;

import com.example.demo.assets.Assets;
import com.example.demo.assets.AssetsRepository;
import com.example.demo.supplies.SuppliesRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

@SpringBootTest
class FarmApplicationTests {

	@Autowired
	AssetsRepository assetsRepository;

	@Autowired
	SuppliesRepository suppliesRepository;

	@Test
	void testItems() {
		Optional<Assets> optionalAssets = assetsRepository.findById(1L);
		if(optionalAssets.isPresent()){
			Assets assets = optionalAssets.get();
			System.out.println(assets.getRelationSupplies().getId());
		}
	}

}
