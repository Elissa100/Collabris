package com.collabris.service;

import com.collabris.entity.User;
import com.collabris.entity.VerificationToken;
import com.collabris.repository.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class TokenService {
    
    @Autowired
    private VerificationTokenRepository tokenRepository;
    
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int TOKEN_LENGTH = 6;
    private final SecureRandom random = new SecureRandom();
    
    @Transactional
    public VerificationToken createVerificationToken(User user, VerificationToken.TokenType tokenType) {
        // Delete any existing unused tokens for this user and type
        tokenRepository.deleteByUserAndTokenType(user, tokenType);
        
        // Generate a new 6-character alphanumeric code
        String code = generateRandomCode();
        
        // Create and save the new token
        VerificationToken token = new VerificationToken(user, code, tokenType);
        return tokenRepository.save(token);
    }
    
    @Transactional
    public boolean verifyToken(String code, VerificationToken.TokenType tokenType) {
        Optional<VerificationToken> tokenOpt = tokenRepository.findByCodeAndTokenType(code, tokenType);
        
        if (tokenOpt.isEmpty()) {
            return false;
        }
        
        VerificationToken token = tokenOpt.get();
        
        // Check if token is expired or already used
        if (token.isExpired() || token.isUsed()) {
            return false;
        }
        
        // Mark token as used
        token.markAsUsed();
        tokenRepository.save(token);
        
        return true;
    }
    
    @Transactional(readOnly = true)
    public Optional<VerificationToken> findValidToken(String code, VerificationToken.TokenType tokenType) {
        Optional<VerificationToken> tokenOpt = tokenRepository.findByCodeAndTokenType(code, tokenType);
        
        if (tokenOpt.isEmpty()) {
            return Optional.empty();
        }
        
        VerificationToken token = tokenOpt.get();
        
        // Return only if token is valid (not expired and not used)
        if (!token.isExpired() && !token.isUsed()) {
            return Optional.of(token);
        }
        
        return Optional.empty();
    }
    
    @Transactional(readOnly = true)
    public Optional<VerificationToken> findLatestTokenByEmail(String email, VerificationToken.TokenType tokenType) {
        return tokenRepository.findLatestUnusedTokenByEmailAndType(email, tokenType);
    }
    
    @Transactional(readOnly = true)
    public Optional<VerificationToken> findLatestTokenByUsername(String username, VerificationToken.TokenType tokenType) {
        return tokenRepository.findLatestUnusedTokenByUsernameAndType(username, tokenType);
    }
    
    @Transactional
    public void consumeToken(VerificationToken token) {
        token.markAsUsed();
        tokenRepository.save(token);
    }
    
    private String generateRandomCode() {
        StringBuilder code = new StringBuilder(TOKEN_LENGTH);
        for (int i = 0; i < TOKEN_LENGTH; i++) {
            code.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return code.toString();
    }
    
    // Scheduled method to clean up expired tokens (runs every hour)
    @Scheduled(fixedRate = 3600000) // 1 hour in milliseconds
    @Transactional
    public void cleanupExpiredTokens() {
        tokenRepository.deleteExpiredTokens(LocalDateTime.now());
    }
    
    @Transactional(readOnly = true)
    public boolean hasValidToken(User user, VerificationToken.TokenType tokenType) {
        Optional<VerificationToken> token = tokenRepository.findByUserAndTokenTypeAndUsedAtIsNull(user, tokenType);
        return token.isPresent() && !token.get().isExpired();
    }
}
