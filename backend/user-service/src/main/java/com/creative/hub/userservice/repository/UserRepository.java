package com.creative.hub.userservice.repository;

import com.creative.hub.userservice.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserModel, Long> {
    UserModel findByEmail(String email);
    UserModel findByPhone(String phone);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
}
