package com.collabris.repository;

import com.collabris.entity.VerificationToken;
import com.collabris.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    
    Optional<VerificationToken> findByCodeAndTokenType(String code, VerificationToken.TokenType tokenType);
    
    Optional<VerificationToken> findByUserAndTokenTypeAndUsedAtIsNull(User user, VerificationToken.TokenType tokenType);
    
    List<VerificationToken> findByUserAndTokenType(User user, VerificationToken.TokenType tokenType);
    
    @Query("SELECT t FROM VerificationToken t WHERE t.user.email = :email AND t.tokenType = :tokenType AND t.usedAt IS NULL ORDER BY t.createdAt DESC")
    Optional<VerificationToken> findLatestUnusedTokenByEmailAndType(@Param("email") String email, @Param("tokenType") VerificationToken.TokenType tokenType);
    
    @Query("SELECT t FROM VerificationToken t WHERE t.user.username = :username AND t.tokenType = :tokenType AND t.usedAt IS NULL ORDER BY t.createdAt DESC")
    Optional<VerificationToken> findLatestUnusedTokenByUsernameAndType(@Param("username") String username, @Param("tokenType") VerificationToken.TokenType tokenType);
    
    @Modifying
    @Query("DELETE FROM VerificationToken t WHERE t.expiresAt < :now")
    void deleteExpiredTokens(@Param("now") LocalDateTime now);
    
    @Modifying
    @Query("DELETE FROM VerificationToken t WHERE t.user = :user AND t.tokenType = :tokenType")
    void deleteByUserAndTokenType(@Param("user") User user, @Param("tokenType") VerificationToken.TokenType tokenType);
}
