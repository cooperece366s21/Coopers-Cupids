package edu.cooper.ece366.store;

import edu.cooper.ece366.model.Conversation;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ConversationStoreImpl implements ConversationStore {
    // List of Conversations
    private List<Conversation> conversationList;
    // Maps userID -> {Conversations}
    private Map<String,List<Conversation>> userConversations; // Are objects pass-by-reference? Does this store one copy?

    public ConversationStoreImpl() {
        conversationList = new ArrayList<Conversation>();
        userConversations = new HashMap<String,List<Conversation>>();
    }

    // Returns list of conversations containing user
    @Override
    public List<Conversation> getUserConversations(String userID) {
        return userConversations.get(userID);
    }

    // Adds Conversation
    @Override
    public void addConversation(Conversation conv) {
        conversationList.add(conv);

        // Adds to map
        List<String> users = conv.getUsers();
        if(userConversations.containsKey(users.get(0))) {
            userConversations.get(users.get(0)).add(conv);
        } else {
            List<Conversation> user1List = new ArrayList<Conversation>();
            user1List.add(conv);
            userConversations.put(users.get(0), user1List);
        }
        if(userConversations.containsKey(users.get(1))) {
            userConversations.get(users.get(1)).add(conv);
        } else {
            List<Conversation> user2List = new ArrayList<Conversation>();
            user2List.add(conv);
            userConversations.put(users.get(1), user2List);
        }
    }

    @Override
    public void deleteConversation(Conversation conv) {
        conversationList.remove(conv);

        // Removes from map
        List<String> users = conv.getUsers();
        userConversations.get(users.get(0)).remove(conv);
        userConversations.get(users.get(1)).remove(conv);
    }
}
