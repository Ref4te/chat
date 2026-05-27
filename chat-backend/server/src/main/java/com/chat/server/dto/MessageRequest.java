package com.chat.server.dto;

import com.chat.server.model.Message;

public record MessageRequest(
        String content,
        Message.MessageType type
) {
}
