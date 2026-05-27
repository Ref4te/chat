package com.chat.server.controller;

import com.chat.server.dto.MessageRequest;
import com.chat.server.dto.MessageResponse;
import com.chat.server.model.Message;
import com.chat.server.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.Authentication;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MessageController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    // История сообщений
    @GetMapping("/api/messages")
    public List<MessageResponse> getMessages() {
        return messageService.getAllMessages();
    }

    @PostMapping("/api/messages")
    public MessageResponse sendMessage(@RequestBody MessageRequest request, Authentication authentication) {
        Message saved = messageService.sendMessage(authentication.getName(), request.content(), request.type());
        MessageResponse response = MessageResponse.fromEntity(saved);
        messagingTemplate.convertAndSend("/topic/messages", response);
        return response;
    }

    // Отправка через WebSocket
    @MessageMapping("/chat.send")
    public void sendMessageWs(@Payload MessageRequest request, Authentication authentication) {
        Message saved = messageService.sendMessage(authentication.getName(), request.content(), request.type());
        messagingTemplate.convertAndSend("/topic/messages", MessageResponse.fromEntity(saved));
    }
}