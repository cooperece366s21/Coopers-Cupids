package edu.cooper.ece366.store;

import java.util.List;

import edu.cooper.ece366.model.Message;

public interface ConversationStore {

    // Returns a list of userIDs of people a user matched with
    List<String> getUserConversations(String userID);

    // Returns a list of messages from a conversation with a user
    List<Message> getUserConversation(String userID, String convoUserID);

    // Sends a message
    void sendMessage(Message mes);
}
