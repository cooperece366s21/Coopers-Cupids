package edu.cooper.ece366.model;

import java.util.ArrayList;
import java.util.List;

public class Conversation {
    // Variables
    // ----------
    private final List<Message> messageHistory;
    private final List<String> users; // UserIDs of users in conversation

    // Methods
    // -------
    public Conversation(String senderID, String recipientID) {
        this.messageHistory = new ArrayList<>();
        this.users = List.of(senderID, recipientID);
    }

    // Given userID (of current user), returns other user in conversation
    public String getRecipient(String uid) {
        return this.users.get(0).equals(uid) ? this.users.get(1) : this.users.get(0);
    }

    public List<String> getUsers() { return this.users; }

    public List<Message> getMessages() { return this.messageHistory; }

    // Adds message to conversation
    public void sendMessage(String senderID, Message.Message_Type messageType, String messageText) {
        Message newMessage = new Message(senderID, messageType, messageText);
        this.messageHistory.add(newMessage);
    }
}
