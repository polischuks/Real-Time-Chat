package chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Map;

@Controller
public class ChatController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    UserRepo userRepo;
    @Autowired
    MessagesRepo messagesRepo;

    @MessageMapping("/chat.register")
    @SendTo("/chat/user-event")
    public UserEvent register(@Payload Username username, SimpMessageHeaderAccessor simpMessageHeaderAccessor) {
        simpMessageHeaderAccessor.getSessionAttributes().put("username", username.username);
        userRepo.addUser(username.getUsername());
        return new UserEvent(username.username, UserEventType.JOINED);
    }

    @MessageMapping("/chat.send")
    @SendTo("/chat/public")
    public WebSockChatMsg send(@Payload WebSockChatMsg msg) {
        messagesRepo.addPublicMessage(msg);
        return msg;
    }

    @MessageMapping("/chat.send.private")
    public void sendTo(@Payload WebSockChatMsg msg) {
        if (msg.getMessageType() == MessageType.GET_ALL) {
            var messages = messagesRepo.getPrivateMessages(msg.sender, msg.getSendTo());
            if (messages != null) {
                messagingTemplate.convertAndSendToUser(msg.getSender(), "/private", Map.of("messageType", MessageType.GET_ALL, "messages", messages));
            }
        } else if (msg.getMessageType() == MessageType.PRIVATE) {
            messagesRepo.addPrivateMessage(msg);
            var response = Map.of("messageType", MessageType.PRIVATE, "messages", List.of(msg));
            messagingTemplate.convertAndSendToUser(msg.getSendTo(), "/private", response);
            messagingTemplate.convertAndSendToUser(msg.getSender(), "/private", response);
        }
    }
}
