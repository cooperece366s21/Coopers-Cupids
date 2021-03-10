package edu.cooper.ece366.model;

public class Message {
    // Enum for message type
    public enum Message_Type {
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
    public Message(String sender, Message_Type type, String text) {
        this.sender = sender;
        this.messageType = type;
        this.messageText = text;

        // TODO: Set Timestamp
    }

    public String getSender() { return this.sender; }

    public Message_Type getMessageType() { return this.messageType; }

    public String getMessageText() { return this.messageText; }

    public String getTimestamp() { return this.timestamp; }

    // Setters aren't needed, since messages cannot be edited
}
