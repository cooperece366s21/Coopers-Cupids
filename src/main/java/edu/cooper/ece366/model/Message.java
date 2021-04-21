package edu.cooper.ece366.model;

import java.sql.Timestamp;

public class Message {
    // Enum for message type
    public enum Message_Type {
        MATCH,
        TEXT,
        IMAGE,
        GIF
    }

    // Variables
    // ---------
    private final String fromUserID;
    private final String toUserID;
    private final Message_Type messageType;
    private final String messageText;
    private final Timestamp timestamp;

    // Methods
    // -------
    public Message(String sender, String receiver, Message_Type type, String text, Timestamp date) {
        this.fromUserID = sender;
        this.toUserID = receiver;
        this.messageType = type;
        this.messageText = text;
        this.timestamp = date;
    }

    public String getSender() { return this.fromUserID; }

    public String getReceiver() { return this.toUserID; }

    public Message_Type getMessageType() { return this.messageType; }

    public String getMessageText() { return this.messageText; }

    public Timestamp getTimestamp() { return this.timestamp; }

    // Setters aren't needed, since messages cannot be edited
}
