package chat;

public class UserEvent {
   String username;
   UserEventType userEventType;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public UserEventType getUserEventType() {
        return userEventType;
    }

    public void setUserEventType(UserEventType userEventType) {
        this.userEventType = userEventType;
    }

    public UserEvent(String username, UserEventType userEventType) {
        this.username = username;
        this.userEventType = userEventType;
    }

    public UserEvent() {
    }
}
