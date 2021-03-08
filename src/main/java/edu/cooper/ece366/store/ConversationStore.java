package edu.cooper.ece366.store;

import edu.cooper.ece366.model.Conversation;

import java.util.List;

public interface ConversationStore {
    // Returns list of conversations containing user
    List<Conversation> getUserConversations(String userID);

    // Adds Conversation
    void addConversation(Conversation conv);

    // Deletes Conversation
    void deleteConversation(Conversation conv);
}
