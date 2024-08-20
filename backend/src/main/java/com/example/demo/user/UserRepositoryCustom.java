package com.example.demo.user;

import com.example.demo.user.User;

import java.util.List;

public interface UserRepositoryCustom {
    List<User> findUserByCriteria(CriteriaSearchUserDto criteriaSearchUserDto);
}
