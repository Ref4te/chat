package com.chat.server.dto;

import com.chat.server.model.Message;

import java.time.LocalDateTime;

public record MessageResponse(
        Long id,
        String sender,
        String content,
        Message.MessageType type,
        LocalDateTime createdAt
) {
    public static MessageResponse fromEntity(Message message) {
        return new MessageResponse(
                message.getId(),
                message.getSender().getUsername(),
                message.getContent(),
                message.getType(),
                message.getCreatedAt()
        );
    }
}
