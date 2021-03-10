package edu.cooper.ece366.handler;

import edu.cooper.ece366.model.Conversation;
import edu.cooper.ece366.model.Message;
import edu.cooper.ece366.model.Profile;
import edu.cooper.ece366.model.User;
import edu.cooper.ece366.service.MatchFeedService;
import edu.cooper.ece366.store.ConversationStore;
import spark.Request;
import spark.Response;
import com.google.gson.Gson;
import com.google.common.hash.Hashing;
import com.google.common.reflect.TypeToken;
import java.nio.charset.StandardCharsets;
import java.util.Hashtable;
import java.util.List;

public class Handler {
    private final MatchFeedService matchService;
    private final ConversationStore conversationStore;
    private final Gson gson;

    // Constructor
    public Handler(MatchFeedService feedService, ConversationStore convStore, Gson gson) {
        this.matchService = feedService;
        this.conversationStore = convStore;
        this.gson = gson;
    }

    // Function to allow users to create account
    // Take arguments through POST body
    public User signup(final Request req, final Response res) {
        Hashtable<String, String> info = this.gson.fromJson(req.body(), new TypeToken<Hashtable<String, String>>(){}.getType());
        if(this.matchService.getUserStore().isUser(info.get("username"))) {
            res.status(400);
            return null;
        }
        this.matchService.getUserStore().addUser(new User(info.get("username"),
                Hashing.sha256().hashString(info.get("password"), StandardCharsets.UTF_8).toString()));
        User user = this.matchService.getUserStore().getUserFromId(info.get("username"));
        res.status(200);
        return user;
    }

    // Function to allow users to login
    // Take arguments through POST body
    public User login(final Request req, final Response res) {
        Hashtable<String, String> info = this.gson.fromJson(req.body(), new TypeToken<Hashtable<String, String>>(){}.getType());
        if(this.matchService.getUserStore().isUser(info.get("username"))
                && this.matchService.getUserStore().validateUser(info.get("username"),
                Hashing.sha256().hashString(info.get("password"), StandardCharsets.UTF_8).toString())) {
            User user = this.matchService.getUserStore().getUserFromId(info.get("username"));
            res.status(200);
            return user;
        }
        res.status(401);
        return null;
    }

    // Function to allow users to logout
    public Object logout(final Request req, final Response res) {
        res.status(200);
        return null;
    }

    // Function to allow users to see account
    // Take arguments through POST body
    public User me(final Request req, final Response res) {
        String userID = req.body();
        if (this.matchService.getUserStore().isUser(userID)) {
            res.status(200);
            return this.matchService.getUserStore().getUserFromId(userID);
        }
        res.status(400);
        return null;
    }

    // Function to get the users account
    // Take argument through URL
    public User getUser(final Request req, final Response res) {
        String userID = req.params(":userId");
        if(this.matchService.getUserStore().isUser(userID)) {
            res.status(200);
            return this.matchService.getUserStore().getUserFromId(userID);
        }
        res.status(400);
        return null;
    }

    // Function to allow users to create profile
    // Take arguments through URL and POST body
    public Profile create(final Request req, final Response res) {
        String userID = req.params(":userId");
        Hashtable<String, String> info = this.gson.fromJson(req.body(), new TypeToken<Hashtable<String, String>>(){}.getType());
        if(this.matchService.getUserStore().isUser(userID) && !this.matchService.getUserStore().getUserFromId(userID).hasProfile()) {
            Profile profile = this.matchService.getUserStore().getUserFromId(userID).getProfile();
            profile.setName(info.get("name"));
            profile.setAge(Integer.parseInt(info.get("age")));
            profile.setPhoto(info.get("photo"));
            profile.setBio(info.get("bio"));
            profile.setLocation(info.get("location"));
            profile.setInterests(info.get("interests"));
            this.matchService.getUserStore().getUserFromId(userID).createdProfile();
            res.status(200);
            return profile;
        }
        res.status(400);
        return null;
    }

    // Function to get the users profile
    // Take argument through URL
    public Profile getProfile(final Request req, final Response res) {
        String userID = req.params(":userId");
        if(this.matchService.getUserStore().isUser(userID)
                && this.matchService.getUserStore().getUserFromId(userID).hasProfile()) {
            res.status(200);
            return this.matchService.getUserStore().getUserFromId(userID).getProfile();
        }
        res.status(400);
        return null;
    }

    // Function to get the users feed
    // Take argument through URL
    public List<User> getFeed(final Request req, final Response res) {
        String userID = req.params(":userId");
        if(this.matchService.getUserStore().isUser(userID)
                && this.matchService.getUserStore().getUserFromId(userID).hasProfile()) {
            res.status(200);
            return this.matchService.getUserFeed(userID, 25);
        }
        res.status(400);
        return null;
    }

    // Function to get the users conversations/matches
    // Take argument through URL
    public List<Conversation> getConvos(final Request req, final Response res) {
        String userID = req.params(":userId");
        if(this.matchService.getUserStore().isUser(userID)
                && this.matchService.getUserStore().getUserFromId(userID).hasProfile()) {
            res.status(200);
            return this.conversationStore.getUserConversations(userID);
        }
        res.status(400);
        return null;
    }

    // Function to get a specific conversation
    // Take arguments through URL
    public Conversation getConvo(final Request req, final Response res) {
        String userID = req.params(":userId");
        String convoUserId = req.params(":matchId");
        if(userID.equals(convoUserId)) {
            res.status(401);
            return null;
        }
        if(this.matchService.getUserStore().isUser(userID)
                && this.matchService.getUserStore().getUserFromId(userID).hasProfile()) {
            Conversation convo = this.conversationStore.getUserConversation(userID, convoUserId);
            if (convo != null) {
                res.status(200);
                return convo;
            }
        }
        res.status(400);
        return null;
    }

    // Function to send a message
    // Take arguments through URL and POST body
    public Object sendMessage(final Request req, final Response res) {
        String userID = req.params(":userId");
        String convoUserId = req.params(":matchId");
        String message = req.body();
        if (this.matchService.getUserStore().isUser(userID) && this.matchService.getUserStore().isUser(convoUserId)
            && this.matchService.getMatchStore().isMatch(userID, convoUserId)) {
            this.conversationStore.getUserConversation(userID, convoUserId).sendMessage(userID, Message.Message_Type.TEXT, message);
            return null;
        }
        res.status(400);
        return null;
    }

    // Function to allow users to like others
    // Take arguments through URL and POST body
    public Object like(final Request req, final Response res) {
        String userID = req.params(":userId");
        String likedUserID = req.body();
        if(this.matchService.getUserStore().isUser(userID)
                && this.matchService.getUserStore().getUserFromId(userID).hasProfile()
                && this.matchService.getUserStore().isUser(likedUserID)
                && this.matchService.getUserStore().getUserFromId(likedUserID).hasProfile()) {
            boolean match = this.matchService.getMatchStore().addLike(userID, likedUserID);
            if (match) {
                this.conversationStore.addConversation(new Conversation(userID, likedUserID));
            }
            res.status(200);
            return null;
        }
        res.status(400);
        return null;
    }

    // Function to allow users to dislike others
    // Take arguments through URL and POST body
    public Object dislike(final Request req, final Response res) {
        String userID = req.params(":userId");
        String dislikedUserID = req.body();
        if(this.matchService.getUserStore().isUser(userID)
                && this.matchService.getUserStore().getUserFromId(userID).hasProfile()
                && this.matchService.getUserStore().isUser(dislikedUserID)
                && this.matchService.getUserStore().getUserFromId(dislikedUserID).hasProfile()) {
            this.matchService.getMatchStore().addDislike(userID, dislikedUserID);
            res.status(200);
            return null;
        }
        res.status(400);
        return null;
    }

    // Function to allow users to unmatch with other users
    // Take arguments through URL
    public Object unmatch(final Request req, final Response res) {
        String userID = req.params(":userId");
        String unmatchedUserID = req.params(":matchId");
        if(this.matchService.getUserStore().isUser(userID) && this.matchService.getUserStore().isUser(unmatchedUserID)
                && this.matchService.getMatchStore().isMatch(userID, unmatchedUserID)) {
            this.matchService.getMatchStore().unmatch(userID, unmatchedUserID);
            this.conversationStore.deleteConversation(userID, unmatchedUserID);
            res.status(200);
            return null;
        }
        res.status(400);
        return null;
    }
}