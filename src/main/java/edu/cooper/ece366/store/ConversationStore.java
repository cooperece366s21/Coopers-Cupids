package edu.cooper.ece366.store;

import java.util.List;

import edu.cooper.ece366.model.Message;

public interface ConversationStore {

    List<String> getUserConversations(String userID);

    List<Message> getUserConversation(String userID, String convoUserID);

    void sendMessage(Message mes);

    // Adds Conversation
    //void addConversation(Conversation conv);

    // Deletes Conversation
    //void deleteConversation(String userID, String deletedUserID);
}
