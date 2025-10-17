package com.collabris.security.jwt;

import com.collabris.security.services.UserDetailsServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class JwtChannelInterceptor implements ChannelInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(JwtChannelInterceptor.class);

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        // Only process the initial CONNECT command
        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            logger.info("New WebSocket CONNECT command received.");

            List<String> authorizationHeaders = accessor.getNativeHeader("Authorization");
            String jwt = null;

            if (authorizationHeaders != null && !authorizationHeaders.isEmpty()) {
                String authHeader = authorizationHeaders.get(0);
                logger.debug("Authorization header found: {}", authHeader);
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    jwt = authHeader.substring(7);
                    logger.debug("Extracted JWT from header.");
                }
            } else {
                logger.warn("No 'Authorization' header found in WebSocket CONNECT frame.");
            }

            try {
                if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                    String username = jwtUtils.getUserNameFromJwtToken(jwt);
                    logger.info("JWT is valid for user: {}", username);

                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    
                    // This is the crucial part for STOMP security context
                    accessor.setUser(authentication);
                    logger.info("Successfully authenticated WebSocket session for user: {}", username);

                } else {
                    // This will now be logged if the token is null or invalid
                    logger.error("WebSocket connection denied: JWT is missing, invalid, or expired.");
                    // Returning null would be another way to reject, but letting it pass
                    // to be rejected by the next layer of security is also fine.
                }
            } catch (Exception e) {
                // This is the most important addition. We now catch ANY unexpected error.
                logger.error("CRITICAL ERROR during WebSocket authentication: {}", e.getMessage(), e);
            }
        }
        return message;
    }
}