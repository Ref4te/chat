package com.chat.server.controller;

import com.chat.server.model.Message;
import com.chat.server.service.JwtService;
import com.chat.server.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MessageController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;
    private final JwtService jwtService;

    @GetMapping("/api/messages")
    public List<Message> getMessages() {
        return messageService.getAllMessages();
    }

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessage chatMessage,
                            SimpMessageHeaderAccessor headerAccessor) {
        String token = headerAccessor.getFirstNativeHeader("Authorization");
        if (token == null || !token.startsWith("Bearer ")) return;

        String username = jwtService.extractUsername(token.substring(7));
        if (username == null) return;

        Message saved = messageService.sendMessage(
                username,
                chatMessage.content(),
                Message.MessageType.TEXT
        );
        messagingTemplate.convertAndSend("/topic/messages", saved);
    }

    public record ChatMessage(String content) {}
}