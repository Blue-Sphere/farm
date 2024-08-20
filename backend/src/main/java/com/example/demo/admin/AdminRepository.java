package com.example.demo.admin;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends CrudRepository<Admin, Integer>, AdminRepositoryCustom {
    Optional<Admin> findByEmail(String email);

    boolean existsByEmail(String email);
}
