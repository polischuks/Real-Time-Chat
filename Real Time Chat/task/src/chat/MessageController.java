package chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MessageController {
    @Autowired
    MessagesRepo messagesRepo;

    @GetMapping("/public-messages")
    public List<WebSockChatMsg> getPublicMessages() {
        return messagesRepo.getPublicMessages();
    }
}

