package edu.cooper.ece366.store;

import edu.cooper.ece366.model.Conversation;

import java.util.List;

public interface ConversationStore {

    List<Conversation> getUserConversations(String userID);

    Conversation getUserConversation(String userID, String convoUserID);

    // Adds Conversation
    void addConversation(Conversation conv);

    // Deletes Conversation
    void deleteConversation(String userID, String deletedUserID);
}
