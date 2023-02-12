package chat;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class UserRepo {
    static List<String> users = new CopyOnWriteArrayList<>();

    public List<String> getUsers() {
        return users;
    }

    public void addUser(String user) {
        users.add(user);
    }

    public void removeUser(String user) {
        users.remove(user);
    }
}
