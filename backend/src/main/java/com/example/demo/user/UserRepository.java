package com.example.demo.user;

import com.example.demo.user.User;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UserRepository extends CrudRepository<User, Integer>, UserRepositoryCustom {

    Optional<User> findByLineId(String lineId);

    Optional<User> findByEmail(String email);
}
