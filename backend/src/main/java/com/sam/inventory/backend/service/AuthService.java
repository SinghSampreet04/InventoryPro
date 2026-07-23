package com.sam.inventory.backend.service;

import com.sam.inventory.backend.dto.AuthRequest;
import com.sam.inventory.backend.dto.AuthResponse;
import com.sam.inventory.backend.entity.User;
import com.sam.inventory.backend.exception.ConflictException;
import com.sam.inventory.backend.exception.InvalidCredentialsException;
import com.sam.inventory.backend.repository.UserRepository;
import com.sam.inventory.backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(AuthRequest request) {
        String username = normalizeUsername(request.username());
        if (userRepository.existsByUsernameIgnoreCase(username)) {
            throw new ConflictException("Username is already in use");
        }

        User user = userRepository.save(new User(
                username,
                passwordEncoder.encode(request.password())
        ));

        return new AuthResponse(jwtService.generateToken(user.getUsername()), user.getUsername());
    }

    @Transactional
    public AuthResponse login(AuthRequest request) {
        String username = normalizeUsername(request.username());
        User user = userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(InvalidCredentialsException::new);

        boolean legacyPassword = !user.getPasswordHash().startsWith("$2");
        boolean passwordMatches = legacyPassword
                ? user.getPasswordHash().equals(request.password())
                : passwordEncoder.matches(request.password(), user.getPasswordHash());

        if (!passwordMatches) {
            throw new InvalidCredentialsException();
        }

        if (legacyPassword) {
            user.setPasswordHash(passwordEncoder.encode(request.password()));
            userRepository.save(user);
        }

        return new AuthResponse(jwtService.generateToken(user.getUsername()), user.getUsername());
    }

    private String normalizeUsername(String username) {
        return username.trim().toLowerCase();
    }
}
