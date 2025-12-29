package com.creative.hub.userservice.service;



import com.creative.hub.userservice.dto.Login;
import com.creative.hub.userservice.dto.Register;
import com.creative.hub.userservice.model.UserModel;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public interface AuthService {
    UserModel login(Login loginDto);
    String getIdFromEmail(String email);
    String register(Register registerDto);
    List<UserModel> getAllUsers();
    Optional<UserModel> getUserById(Long id);
    UserModel updateUser(Long id, UserModel user);
    void deleteUser(Long id);
    boolean verifyPassword(String plainPassword, String hashedPassword);
}
