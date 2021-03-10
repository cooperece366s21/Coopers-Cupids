package edu.cooper.ece366.store;

import edu.cooper.ece366.model.Conversation;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ConversationStoreImpl implements ConversationStore {
    // Maps userID -> {Conversations}
    private Map<String,List<Conversation>> userConversations; // Are objects pass-by-reference? Does this store one copy?

    public ConversationStoreImpl() {
        this.userConversations = new HashMap<>();
    }

    // Returns list of conversations containing user
    @Override
    public List<Conversation> getUserConversations(String userID) { return this.userConversations.get(userID); }

    @Override
    public Conversation getUserConversation(String userID, String convoUserID) {
        List<Conversation> convos = this.getUserConversations(userID);
        for(Conversation c : convos) {
            if (c.getUsers().contains(userID) && c.getUsers().contains(convoUserID)) {
                return c;
            }
        }
        return null;
    }

    // Adds Conversation
    @Override
    public void addConversation(Conversation conv) {
        // Adds to map
        List<String> users = conv.getUsers();
        if(this.userConversations.containsKey(users.get(0))) {
            this.userConversations.get(users.get(0)).add(conv);
        }
        else {
            List<Conversation> user1List = new ArrayList<>();
            user1List.add(conv);
            this.userConversations.put(users.get(0), user1List);
        }
        if(this.userConversations.containsKey(users.get(1))) {
            this.userConversations.get(users.get(1)).add(conv);
        }
        else {
            List<Conversation> user2List = new ArrayList<>();
            user2List.add(conv);
            this.userConversations.put(users.get(1), user2List);
        }
    }

    @Override
    public void deleteConversation(String userID, String deletedUserID) {
        // Removes from map
        Conversation c = this.getUserConversation(userID, deletedUserID);
        this.userConversations.get(userID).remove(c);
        this.userConversations.get(deletedUserID).remove(c);

    }
}