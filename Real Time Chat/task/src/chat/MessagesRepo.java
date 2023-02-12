package chat;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class MessagesRepo {
    List<WebSockChatMsg> publicMessages = new CopyOnWriteArrayList<>();
    Map<Map.Entry<String, String>, List<WebSockChatMsg>> privateMessages = new ConcurrentHashMap<>();

    public List<WebSockChatMsg> getPublicMessages() {
        return publicMessages;
    }

    public void addPublicMessage(WebSockChatMsg msg) {
        publicMessages.add(msg);
    }

    public void addPrivateMessage(WebSockChatMsg msg) {
        var entry = Map.entry(msg.getSender(), msg.getSendTo());

        if (!privateMessages.containsKey(entry)) {
            entry = Map.entry(msg.getSendTo(), msg.getSender());
        }

        if (privateMessages.containsKey(entry)) {
            privateMessages.get(entry).add(msg);
        } else {
            privateMessages.put(entry, new CopyOnWriteArrayList<>(List.of(msg)));
        }
    }

    public List<WebSockChatMsg> getPrivateMessages(String userA, String userB) {
        var entry = Map.entry(userA, userB);

        if (!privateMessages.containsKey(entry)) {
            entry = Map.entry(userB, userA);
        }

        return privateMessages.get(entry);
    }
}
