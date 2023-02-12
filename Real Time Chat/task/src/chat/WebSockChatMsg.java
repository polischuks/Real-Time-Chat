package chat;

public class WebSockChatMsg {
    public String sender;
    public String message;
    private String date;
    private String sendTo;
    private MessageType messageType;

    public WebSockChatMsg(String sender, String message, String date, String sendTo, MessageType messageType) {
        this.sender = sender;
        this.message = message;
        this.date = date;
        this.sendTo = sendTo;
        this.messageType = messageType;
    }

    public WebSockChatMsg() {
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getSendTo() {
        return sendTo;
    }

    public void setSendTo(String sendTo) {
        this.sendTo = sendTo;
    }

    public MessageType getMessageType() {
        return messageType;
    }

    public void setMessageType(MessageType messageType) {
        this.messageType = messageType;
    }
}