package com.collabris.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.messaging.MessageSecurityMetadataSourceRegistry;
import org.springframework.security.config.annotation.web.socket.AbstractSecurityWebSocketMessageBrokerConfigurer;

@Configuration
// THIS IS THE FIX: This annotation is deprecated but is REQUIRED for this specific
// interaction between WebSocket security and @PreAuthorize to work correctly in this version of Spring.
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSocketSecurityConfig extends AbstractSecurityWebSocketMessageBrokerConfigurer {

    @Override
    protected void configureInbound(MessageSecurityMetadataSourceRegistry messages) {
        messages
            // Allow anyone to connect. The authentication happens in our JwtChannelInterceptor.
            .simpTypeMatchers(SimpMessageType.CONNECT).permitAll()
            // Allow anyone to disconnect.
            .simpTypeMatchers(SimpMessageType.DISCONNECT).permitAll()
            // Any message being SENT to the server (e.g., a chat message) must be authenticated.
            .simpDestMatchers("/app/**").authenticated()
            // Any attempt to SUBSCRIBE to a topic must be authenticated.
            .simpTypeMatchers(SimpMessageType.SUBSCRIBE).authenticated()
            // Deny any other type of message by default for security.
            .anyMessage().denyAll();
    }

    @Override
    protected boolean sameOriginDisabled() {
        // We disable CSRF for STOMP, as we are using JWT for authentication.
        return true;
    }
}