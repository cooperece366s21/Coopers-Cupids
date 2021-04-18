package edu.cooper.ece366.store;

import java.util.List;
import org.jdbi.v3.core.Jdbi;

import edu.cooper.ece366.model.Conversation;

public class ConversationStoreMySQL implements ConversationStore {

    private final Jdbi jdbi;

    public ConversationStoreMySQL(final Jdbi jdbi) { this.jdbi = jdbi; }

    // Returns list of conversations containing user
    @Override
    public List<Conversation> getUserConversations(String userID) {
        return null;
    }

    // Returns a specific conversation
    @Override
    public Conversation getUserConversation(String userID, String convoUserID) {
        return null;
    }

    // Adds Conversation
    @Override
    public void addConversation(Conversation conv) {

    }

    @Override
    public void deleteConversation(String userID, String deletedUserID) {

    }
}
