package com.project.task4.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Objects;

@Controller
public class MessageController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/private-message")
    public void send(SimpMessageHeaderAccessor smha, @Payload String data) {
        String username = data.substring(0, data.indexOf("<br>"));
        String message = "<strong>"+ Objects.requireNonNull(smha.getUser()).getName() +"</strong>"+ data.substring(data.indexOf("<br>"));
        simpMessagingTemplate.convertAndSendToUser(username, "/home/private-messages", message);
    }
}
