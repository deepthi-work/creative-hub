package com.creative.hub.userservice.controller;

import com.creative.hub.userservice.dto.Login;
import com.creative.hub.userservice.dto.Register;
import com.creative.hub.userservice.model.UserModel;
import com.creative.hub.userservice.service.AuthServiceImpl;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);
    private AuthServiceImpl service;

    public UserController(AuthServiceImpl userService){
        this.service = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> createUser(@Valid @RequestBody Register register){
        try {
            String result = service.register(register);
            Map<String, String> response = new HashMap<>();
            response.put("message", result);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error during registration: " + e.getMessage());
            Map<String, String> response = new HashMap<>();
            response.put("error", "Registration failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody Login login, HttpSession session){
        log.info("Processing Login Request for: "+ login.getEmailOrPhone());
        Map<String, Object> response = new HashMap<>();

        try{
            Optional<UserModel> userModelOptional = Optional.ofNullable(service.login(login));
            if(userModelOptional.isPresent()){
                UserModel user = userModelOptional.get();

                // Verify password
                if (!service.verifyPassword(login.getPassword(), user.getPassword())) {
                    log.warn("Invalid password for user: " + login.getEmailOrPhone());
                    response.put("error", "Invalid email/phone or password");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
                }

                // Set session attributes
                session.setAttribute("username", user.getName());
                session.setAttribute("userId", user.getId());
                session.setAttribute("userEmail", user.getEmail());
                session.setAttribute("authenticated", true);

                log.info("User logged in successfully: " + user.getName());

                // Return user info (without password)
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("id", user.getId());
                userInfo.put("name", user.getName());
                userInfo.put("email", user.getEmail());
                userInfo.put("phone", user.getPhone());
                userInfo.put("address", user.getAddress());

                response.put("message", "Login successful");
                response.put("user", userInfo);
                return ResponseEntity.ok(response);
            }
            else{
                log.warn("User doesn't exist");
                response.put("error", "Invalid email/phone or password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        } catch(Exception e){
            log.error("Error during login: "+e.getMessage(), e);
            response.put("error", "An error has occurred");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpSession session){
        log.info("Processing Logout Request");
        session.invalidate();
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/session/check")
    public ResponseEntity<Map<String, Object>> checkSession(HttpSession session){
        Map<String, Object> response = new HashMap<>();

        Boolean authenticated = (Boolean) session.getAttribute("authenticated");
        if (authenticated != null && authenticated) {
            response.put("authenticated", true);
            response.put("username", session.getAttribute("username"));
            response.put("userId", session.getAttribute("userId"));
            response.put("userEmail", session.getAttribute("userEmail"));
            return ResponseEntity.ok(response);
        } else {
            response.put("authenticated", false);
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/create/session")
    public ResponseEntity<Map<String, String>> createSession(HttpSession session, @RequestParam(required = false) String name) {
        if (name != null) {
            session.setAttribute("username", name);
        }
        String sessionId = session.getId();
        Map<String, String> response = new HashMap<>();
        response.put("sessionId", sessionId);
        response.put("message", "Session created");
        return ResponseEntity.ok(response);
    }
}