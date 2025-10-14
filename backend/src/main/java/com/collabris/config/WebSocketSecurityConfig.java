package com.collabris.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.messaging.MessageSecurityMetadataSourceRegistry;
import org.springframework.security.config.annotation.web.socket.AbstractSecurityWebSocketMessageBrokerConfigurer;

@Configuration
public class WebSocketSecurityConfig extends AbstractSecurityWebSocketMessageBrokerConfigurer {

    @Override
    protected void configureInbound(MessageSecurityMetadataSourceRegistry messages) {
        messages
            // Any client sending a message to an "/app" destination must be authenticated.
            .simpDestMatchers("/app/**").authenticated()
            // All other messages (like subscribing, etc.) must also be authenticated.
            .anyMessage().authenticated();
    }

    @Override
    protected boolean sameOriginDisabled() {
        // We disable CSRF for STOMP, as we are using JWT for authentication.
        return true;
    }
}