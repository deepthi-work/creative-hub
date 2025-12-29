package com.creative.hub.userservice.service;

import com.creative.hub.userservice.model.UserModel;
import com.creative.hub.userservice.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private UserRepository userRepository;

    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }
    public List<UserModel> getAllUsers(){
        return userRepository.findAll();
    }
}
