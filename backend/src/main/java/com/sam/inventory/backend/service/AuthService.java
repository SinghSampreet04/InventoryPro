package com.sam.inventory.backend.service;

import com.sam.inventory.backend.entity.User;
import com.sam.inventory.backend.repository.UserRepository;
import org.springframework.stereotype.Service;


@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String register(User user) {
    user.setUsername(user.getUsername().trim());
    user.setPassword(user.getPassword().trim());

    userRepository.save(user);
    return "User registered";
    }

public String login(User user) {

    System.out.println("INPUT USERNAME: " + user.getUsername());

    User dbUser = userRepository.findAll()
            .stream()
            .filter(u -> u.getUsername().equals(user.getUsername()))
            .findFirst()
            .orElse(null);

    if (dbUser == null) {
        return "LOGIN_FAILED";
    }

    if (dbUser.getPassword().equals(user.getPassword())) {
        return "LOGIN_SUCCESS";
    }

    return "LOGIN_FAILED";
}
}