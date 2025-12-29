package com.creative.hub.userservice.service;

import com.creative.hub.userservice.dto.Login;
import com.creative.hub.userservice.dto.Register;
import com.creative.hub.userservice.exception.EmailAlreadyExistsException;
import com.creative.hub.userservice.model.UserModel;
import com.creative.hub.userservice.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.mindrot.jbcrypt.BCrypt;

import java.time.LocalDate;
import java.util.*;

@Service
public class AuthServiceImpl implements AuthService{
    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);
    @Autowired
    private UserRepository userRepository;
    @Autowired
    public AuthServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserModel login(Login loginDto) {
        if(loginDto.getEmailOrPhone().contains("@")) {
            return userRepository.findByEmail(loginDto.getEmailOrPhone());
        }
           return userRepository.findByPhone(loginDto.getEmailOrPhone());
    }

    @Override
    public boolean verifyPassword(String plainPassword, String hashedPassword) {
        try {
            return BCrypt.checkpw(plainPassword, hashedPassword);
        } catch (Exception e) {
            log.error("Error verifying password: " + e.getMessage());
            return false;
        }
    }

    @Override
    public String register(Register registerDto) {

        // check for email exists in database
        if(userRepository.existsByEmail(registerDto.getEmail())){
            log.error("Email already exists!!!");
            throw new EmailAlreadyExistsException("This email already exists. Please login, or use another email.");
        }

        UserModel user = new UserModel();
        user.setName(registerDto.getName());
        user.setContactPreference(registerDto.getContactPreference());
        user.setAddress(registerDto.getAddress());
        user.setEmail(registerDto.getEmail());
        user.setPhone(registerDto.getPhone());
        String salt = BCrypt.gensalt();
        String hashedPassword = BCrypt.hashpw(registerDto.getPassword(),salt);
        user.setPassword(hashedPassword);
        user.setCreatedDate(LocalDate.now());
        user.setUpdatedDate(LocalDate.now());
        userRepository.save(user);

        log.info(String.valueOf(user));
        return "User registered successfully!";
    }
    @Override
    public List<UserModel> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public String getIdFromEmail(String email){
        UserModel user = userRepository.findByEmail(email);
        return Long.toString(user.getId());
    }
    @Override
    public Optional<UserModel> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public UserModel updateUser(Long id, UserModel user) {
        // Check if the user with the given ID exists in the database
        Optional<UserModel> existingUserOptional = userRepository.findById(id);
        if (existingUserOptional.isEmpty()) {
            log.error("User not found with id: " + id);
        }

        // Update user details
        UserModel existingUser = existingUserOptional.get();
        existingUser.setName(user.getName());
        existingUser.setEmail(user.getEmail());
        existingUser.setPassword(user.getPassword());
        existingUser.setAddress(user.getAddress());
        // Save the updated user
        return userRepository.save(existingUser);
    }

    @Override
    public void deleteUser(Long id) {
        // Check if the user with the given ID exists in the database
        if (!userRepository.existsById(id)) {
            log.error("User not found with id: " + id);
        }

        // Delete the user
        userRepository.deleteById(id);
    }
}
