package edu.cooper.ece366.model;

import edu.cooper.ece366.model.Message;

import java.util.ArrayList;
import java.util.List;

public class Conversation {
    // Variables
    // ----------
    private List<Message> messageHistory;
    private final List<String> users; // UserIDs of users in conversation

    // Methods
    // -------
    public Conversation(String senderID, String recipientID) {
        messageHistory = new ArrayList<Message>();
        users = List.of(senderID, recipientID);
    }

    // Given userID (of current user), returns other user in conversation
    public String getRecipient(String uid) {
        return this.users.get(0).equals(uid) ? this.users.get(1) : this.users.get(0);
    }

    public List<String> getUsers() {
        return users;
    }

    public List<Message> getMessages() {
        return messageHistory;
    }

    // Adds message to conversation
    public void sendMessage(String senderID, Message.Message_Type messageType, String messageText) {
        Message newMessage = new Message(senderID, this.getRecipient(senderID), messageType, messageText);
        this.messageHistory.add(newMessage);
    }
}
