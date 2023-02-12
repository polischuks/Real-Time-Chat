package chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserController {
    @Autowired
    UserRepo userRepo;

    @GetMapping("/users")
    public List<String> getOnlineUsers() {
        return userRepo.getUsers();
    }
}
