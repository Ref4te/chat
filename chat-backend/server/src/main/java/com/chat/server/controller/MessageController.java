package com.chat.server.controller;

import com.chat.server.model.Message;
import com.chat.server.service.JwtService;
import com.chat.server.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MessageController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;
    private final JwtService jwtService;

    // История сообщений
    @GetMapping("/api/messages")
    public List<Message> getMessages() {
        return messageService.getAllMessages();
    }

    // Отправка через WebSocket
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessage chatMessage,
                            Principal principal,
                            SimpMessageHeaderAccessor headerAccessor) {
        String username = principal != null ? principal.getName() : extractUsernameFromHeaders(headerAccessor);
        if (username == null || username.isBlank()) {
            return;
        }

        Message saved = messageService.sendMessage(
                username,
                chatMessage.content(),
                Message.MessageType.TEXT
        );
        messagingTemplate.convertAndSend("/topic/messages", saved);
    }

    private String extractUsernameFromHeaders(SimpMessageHeaderAccessor headerAccessor) {
        String authHeader = headerAccessor.getFirstNativeHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        String token = authHeader.substring(7);
        if (!jwtService.isTokenValid(token)) {
            return null;
        }
        return jwtService.extractUsername(token);
    }

    public record ChatMessage(String content) {}
}
