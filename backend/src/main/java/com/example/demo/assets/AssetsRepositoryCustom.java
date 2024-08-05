package com.example.demo.assets;

import java.util.List;

public interface AssetsRepositoryCustom {
    List<Assets> findAssetsByCriteria(CriteriaSearchAssetsDto criteriaSearchAssetsDto);
}
