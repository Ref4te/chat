package com.chat.server.service;

import com.chat.server.model.Message;
import com.chat.server.model.User;
import com.chat.server.repository.MessageRepository;
import com.chat.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public Message sendMessage(String username, String content, Message.MessageType type) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        Message message = new Message();
        message.setSender(user);
        message.setContent(content);
        message.setType(type);

        return messageRepository.save(message);
    }

    public List<Message> getAllMessages() {
        return messageRepository.findAllByOrderByCreatedAtAsc();
    }
}