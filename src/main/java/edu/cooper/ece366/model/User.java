package edu.cooper.ece366.model;

import edu.cooper.ece366.model.Profile;
import edu.cooper.ece366.model.Conversation;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class User {
    // Variables
    // ----------
    private Profile profile;
    private List<Conversation> conversations;
    private final String userID;

    // Methods
    // --------

    // Constructor
    public User(String uid) {
        this.conversations = new ArrayList<Conversation>();
        this.userID = uid;
    }

    // Returns user's profile
    public Profile getProfile() {
        return this.profile;
    }

    // Returns user's conversations
    public List<Conversation>  getConversations() {
        return this.conversations;
    }

    // Returns conversation with specified user
    // Returns empty list if none
    public List<Conversation> searchConversation(String uid) {
        return conversations.stream()
                            .filter(c -> c.getRecipient(userID).equals(uid))
                            .collect(Collectors.toList());
    }
}

