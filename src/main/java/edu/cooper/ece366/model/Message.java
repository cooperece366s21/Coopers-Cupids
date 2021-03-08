package edu.cooper.ece366.model;

public class Message {
    // Enum for message type
    enum Message_Type {
        TEXT,
        IMAGE,
        GIF
    }

    // Variables
    // ---------
    private String sender;
    private String recipient;
    private Message_Type messageType;
    private String messageText;
    private String timestamp; // TODO: Change to Date Type in future

    // Methods
    // -------
    public Message(String sender, String recipient, Message_Type type, String text) {
        this.sender = sender;
        this.recipient = recipient;
        this.messageType = type;
        this.messageText = text;

        // TODO: Set Timestamp
    }

    public String getSender() {
        return sender;
    }

    public String getRecipient() {
        return recipient;
    }

    public Message_Type getMessageType() {
        return messageType;
    }

    public String getMessageText() {
        return messageText;
    }

    public String getTimestamp() {
        return timestamp;
    }

    // Setters aren't needed, since messages cannot be edited
}
