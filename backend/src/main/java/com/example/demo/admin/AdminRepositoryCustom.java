package com.example.demo.admin;

import java.util.List;

public interface AdminRepositoryCustom {
    List<Admin> findAdminByCriteria(CriteriaSearchAdminDto criteriaSearchAdminDto);
}
