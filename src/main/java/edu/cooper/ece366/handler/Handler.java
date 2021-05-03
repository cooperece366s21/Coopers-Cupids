package edu.cooper.ece366.handler;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Hashtable;
import java.nio.charset.StandardCharsets;

import spark.Request;
import spark.Response;
import com.google.gson.Gson;
import com.google.common.hash.Hashing;
import com.google.common.reflect.TypeToken;

import edu.cooper.ece366.model.Message;
import edu.cooper.ece366.model.Profile;
import edu.cooper.ece366.model.User;
import edu.cooper.ece366.auth.Cookies;
import edu.cooper.ece366.service.MatchFeedService;
import edu.cooper.ece366.store.ConversationStore;
import edu.cooper.ece366.response.UserResponse;
import edu.cooper.ece366.response.ProfileResponse;
import edu.cooper.ece366.response.YourProfileResponse;

public class Handler {
    private final MatchFeedService matchService;
    private final ConversationStore conversationStore;
    private final Cookies cookies;
    private final Gson gson;

    // Constructor
    public Handler(MatchFeedService feedService, ConversationStore convStore, Cookies cookies, Gson gson) {
        this.matchService = feedService;
        this.conversationStore = convStore;
        this.cookies = cookies;
        this.gson = gson;
    }

    // Function to allow users to create account
    // Take arguments through POST body
//    public User signup(final Request req, final Response res) {
//        Hashtable<String, String> info = this.gson.fromJson(req.body(), new TypeToken<Hashtable<String, String>>(){}.getType());
//        if(this.matchService.getUserStore().isUser(info.get("username"))) {
//            res.status(400);
//            return null;
//        }
//        this.matchService.getUserStore().addUser(new User(info.get("username"),
//                Hashing.sha256().hashString(info.get("password"), StandardCharsets.UTF_8).toString()));
//        User user = this.matchService.getUserStore().getUserFromId(info.get("username"));
//        res.status(200);
//        return user;
//    }
    public UserResponse signup(final Request req, final Response res) {
        Hashtable<String, String> info = this.gson.fromJson(req.body(), new TypeToken<Hashtable<String, String>>(){}.getType());
        if(this.matchService.getUserStore().checkEmail(info.get("username"))) {
            // email already in use
            res.status(400);
            return null;
        }
        this.matchService.getUserStore().addUser(new User(
                this.matchService.getUserStore().assignUserId(),
                info.get("username"),
                Hashing.sha256().hashString(info.get("password"), StandardCharsets.UTF_8).toString(),
                false));
        String userID = this.matchService.getUserStore().getIdFromEmail(info.get("username"));
        UserResponse user = new UserResponse(this.matchService.getUserStore().getUserFromId(userID));
        String cookie = this.cookies.assignCookie(userID);
        res.header("auth_token", cookie);
        res.status(201);
        return user;
    }

    // Function to allow users to login
    // Take arguments through POST body
//    public User login(final Request req, final Response res) {
//        Hashtable<String, String> info = this.gson.fromJson(req.body(), new TypeToken<Hashtable<String, String>>(){}.getType());
//        if(this.matchService.getUserStore().isUser(info.get("username"))
//                && this.matchService.getUserStore().validateUser(info.get("username"),
//                Hashing.sha256().hashString(info.get("password"), StandardCharsets.UTF_8).toString())) {
//            User user = this.matchService.getUserStore().getUserFromId(info.get("username"));
//            res.status(200);
//            return user;
//        }
//        res.status(401);
//        return null;
//    }
    public UserResponse login(final Request req, final Response res) {
        Hashtable<String, String> info = this.gson.fromJson(req.body(), new TypeToken<Hashtable<String, String>>(){}.getType());
        if(this.matchService.getUserStore().validateUser(
                info.get("username"),
                Hashing.sha256().hashString(info.get("password"), StandardCharsets.UTF_8).toString())) {
            String userID = this.matchService.getUserStore().getIdFromEmail(info.get("username"));
            UserResponse user = new UserResponse(this.matchService.getUserStore().getUserFromId(userID));
            String cookie = this.cookies.assignCookie(userID);
            res.header("auth_token", cookie);
            res.status(200);
            return user;
        }
        res.status(401);
        return null;
    }

    // Function to allow users to logout
//    public Object logout(final Request req, final Response res) {
//        res.status(200);
//        return null;
//    }
    public Object logout(final Request req, final Response res) {
        String cookie = req.headers("auth_token");
        if (cookie == null) {
            res.status(401);
            return null;
        }
        String userID = this.cookies.getUser(cookie);
        if (userID != null) {
            // if cookies is valid, delete it
            // potential to log others out since not checking userID against anything
            // worry about later
            this.cookies.deleteCookie(cookie, userID);
            res.status(200);
            return null;
        }
        res.status(400);
        return null;
    }

    // Function to allow users to see account
    // Take arguments through POST body
//    public User me(final Request req, final Response res) {
//        String userID = req.body();
//        if (this.matchService.getUserStore().isUser(userID)) {
//            res.status(200);
//            return this.matchService.getUserStore().getUserFromId(userID);
//        }
//        res.status(400);
//        return null;
//    }

    // Function to get the users account
    // Take argument through URL
//    public User getUser(final Request req, final Response res) {
//        String userID = req.params(":userId");
//        if(this.matchService.getUserStore().isUser(userID)) {
//            res.status(200);
//            return this.matchService.getUserStore().getUserFromId(userID);
//        }
//        res.status(400);
//        return null;
//    }
    public UserResponse getUser(final Request req, final Response res) {
        String email = req.params(":email");
        String cookie = req.headers("auth_token");
        if (cookie == null) {
            // no cookie provided
            res.status(401);
            return null;
        }
        if (!this.matchService.getUserStore().checkEmail(email)) {
            // no account associated with email
            res.status(404);
            return null;
        }
        String userID = this.matchService.getUserStore().getIdFromEmail(email);
        if (!this.cookies.verifyCookie(cookie, userID)) {
            // malicious access, login timeout, or random user/cookie
            res.status(403);
            return null;
        }
        res.header("auth_token", cookie);
        res.status(200);
        return new UserResponse(this.matchService.getUserStore().getUserFromId(userID));
    }

    public Object deleteAccount(final Request req, final Response res) {
        String email = req.params(":email");
        String cookie = req.headers("auth_token");
        if (cookie == null) {
            // no cookie provided
            res.status(401);
            return null;
        }
        if (!this.matchService.getUserStore().checkEmail(email)) {
            // no account associated with email
            res.status(404);
            return null;
        }
        String userID = this.matchService.getUserStore().getIdFromEmail(email);
        if (!this.cookies.verifyCookie(cookie, userID)) {
            // malicious access, login timeout, or random user/cookie
            res.status(403);
            return null;
        }
        Hashtable<String, String> info = this.gson.fromJson(req.body(), new TypeToken<Hashtable<String, String>>(){}.getType());
        if (this.matchService.getUserStore().validateUser(
                email,
                Hashing.sha256().hashString(info.get("password"), StandardCharsets.UTF_8).toString())) {
            this.matchService.getUserStore().deleteUser(userID);
            res.status(200);
            return null;
        }
        // wrong password
        res.header("auth_token", cookie);
        res.status(403);
        return null;
    }

    public UserResponse changeEmail(final Request req, final Response res) {
        String email = req.params(":email");
        String cookie = req.headers("auth_token");
        if (cookie == null) {
            // no cookie provided
            res.status(401);
            return null;
        }
        if (!this.matchService.getUserStore().checkEmail(email)) {
            // no account associated with email
            res.status(404);
            return null;
        }
        String userID = this.matchService.getUserStore().getIdFromEmail(email);
        if (!this.cookies.verifyCookie(cookie, userID)) {
            // malicious access, login timeout, or random user/cookie
            res.status(403);
            return null;
        }
        Hashtable<String, String> info = this.gson.fromJson(req.body(), new TypeToken<Hashtable<String, String>>(){}.getType());
        if (this.matchService.getUserStore().validateUser(
                email,
                Hashing.sha256().hashString(info.get("password"), StandardCharsets.UTF_8).toString())) {
            this.matchService.getUserStore().updateEmail(userID, info.get("email"));
            res.header("auth_token", cookie);
            res.status(200);
            return new UserResponse(this.matchService.getUserStore().getUserFromId(userID));
        }
        // wrong password
        res.header("auth_token", cookie);
        res.status(403);
        return null;
    }

    public UserResponse changePassword(final Request req, final Response res) {
        String email = req.params(":email");
        String cookie = req.headers("auth_token");
        if (cookie == null) {
            // no cookie provided
            res.status(401);
            return null;
        }
        if (!this.matchService.getUserStore().checkEmail(email)) {
            // no account associated with email
            res.status(404);
            return null;
        }
        String userID = this.matchService.getUserStore().getIdFromEmail(email);
        if (!this.cookies.verifyCookie(cookie, userID)) {
            // malicious access, login timeout, or random user/cookie
            res.status(403);
            return null;
        }
        Hashtable<String, String> info = this.gson.fromJson(req.body(), new TypeToken<Hashtable<String, String>>(){}.getType());
        if (this.matchService.getUserStore().validateUser(
                email,
                Hashing.sha256().hashString(info.get("old_password"), StandardCharsets.UTF_8).toString())) {
            this.matchService.getUserStore().updatePassword(
                    userID,
                    Hashing.sha256().hashString(info.get("new_password"), StandardCharsets.UTF_8).toString());
            res.header("auth_token", cookie);
            res.status(200);
            return new UserResponse(this.matchService.getUserStore().getUserFromId(userID));
        }
        // wrong password
        res.header("auth_token", cookie);
        res.status(403);
        return null;
    }

    // Function to allow users to create profile
    // Take arguments through URL and POST body
//    public Profile create(final Request req, final Response res) {
//        String userID = req.params(":userId");
//        Hashtable<String, String> info = this.gson.fromJson(req.body(), new TypeToken<Hashtable<String, String>>(){}.getType());
//        if(this.matchService.getUserStore().isUser(userID) && !this.matchService.getUserStore().getUserFromId(userID).hasProfile()) {
//            Profile profile = this.matchService.getUserStore().getUserFromId(userID).getProfile();
//            profile.setName(info.get("name"));
//            profile.setAge(Integer.parseInt(info.get("age")));
//            profile.setPhoto(info.get("photo"));
//            profile.setBio(info.get("bio"));
//            profile.setLocation(info.get("location"));
//            profile.setInterests(info.get("interests"));
//            this.matchService.getUserStore().getUserFromId(userID).createdProfile();
//            res.status(200);
//            return profile;
//        }
//        res.status(400);
//        return null;
//    }
    public YourProfileResponse create(final Request req, final Response res) {
        String email = req.params(":email");
        String cookie = req.headers("auth_token");
        if (cookie == null) {
            // no cookie provided
            res.status(401);
            return null;
        }
        if (!this.matchService.getUserStore().checkEmail(email)) {
            // no account associated with email
            res.status(404);
            return null;
        }
        String userID = this.matchService.getUserStore().getIdFromEmail(email);
        if (!this.cookies.verifyCookie(cookie, userID)) {
            // malicious access, login timeout, or random user/cookie
            res.status(403);
            return null;
        }
        Hashtable<String, String> info = this.gson.fromJson(req.body(), new TypeToken<Hashtable<String, String>>(){}.getType());
        if(!this.matchService.getUserStore().getUserFromId(userID).hasProfile()) {
            this.matchService.getUserStore().addProfile(new Profile(userID,
                    info.get("name"),
                    Integer.parseInt(info.get("age")),
                    info.get("photo"),
                    info.get("bio"),
                    info.get("location"),
                    info.get("interests")));
            res.header("auth_token", cookie);
            res.status(201);
            return new YourProfileResponse(this.matchService.getUserStore().getProfileFromId(userID));
        }
        // should only get here if profile already exists (dont log them out)
        res.header("auth_token", cookie);
        res.status(400);
        return null;
    }

    // Function to get the users profile
    // Take argument through URL
//    public Profile getProfile(final Request req, final Response res) {
//        String userID = req.params(":userId");
//        if(this.matchService.getUserStore().isUser(userID)
//                && this.matchService.getUserStore().getUserFromId(userID).hasProfile()) {
//            res.status(200);
//            return this.matchService.getUserStore().getUserFromId(userID).getProfile();
//        }
//        res.status(400);
//        return null;
//    }
    public YourProfileResponse getProfile(final Request req, final Response res) {
        String email = req.params(":email");
        String cookie = req.headers("auth_token");
        if (cookie == null) {
            // no cookie provided
            res.status(401);
            return null;
        }
        if (!this.matchService.getUserStore().checkEmail(email)) {
            // no account associated with email
            res.status(404);
            return null;
        }
        String userID = this.matchService.getUserStore().getIdFromEmail(email);
        if (!this.cookies.verifyCookie(cookie, userID)) {
            // malicious access, login timeout, or random user/cookie
            res.status(403);
            return null;
        }
        if(this.matchService.getUserStore().getUserFromId(userID).hasProfile()) {
            res.header("auth_token", cookie);
            res.status(200);
            return new YourProfileResponse(this.matchService.getUserStore().getProfileFromId(userID));
        }
        // should only get here if doesnt have profile (dont log them out)
        res.header("auth_token", cookie);
        res.status(400);
        return null;
    }

    public YourProfileResponse editProfile(final Request req, final Response res) {
        String email = req.params(":email");
        String cookie = req.headers("auth_token");
        if (cookie == null) {
            // no cookie provided
            res.status(401);
            return null;
        }
        if (!this.matchService.getUserStore().checkEmail(email)) {
            // no account associated with email
            res.status(404);
            return null;
        }
        String userID = this.matchService.getUserStore().getIdFromEmail(email);
        if (!this.cookies.verifyCookie(cookie, userID)) {
            // malicious access, login timeout, or random user/cookie
            res.status(403);
            return null;
        }
        Hashtable<String, String> info = this.gson.fromJson(req.body(), new TypeToken<Hashtable<String, String>>(){}.getType());
        if(this.matchService.getUserStore().getUserFromId(userID).hasProfile()) {
            this.matchService.getUserStore().updateProfile(new Profile(userID,
                    info.get("name"),
                    Integer.parseInt(info.get("age")),
                    info.get("photo"),
                    info.get("bio"),
                    info.get("location"),
                    info.get("interests")));
            res.header("auth_token", cookie);
            res.status(200);
            return new YourProfileResponse(this.matchService.getUserStore().getProfileFromId(userID));
        }
        // should only get here if doesnt have profile (dont log them out)
        res.header("auth_token", cookie);
        res.status(400);
        return null;
    }

    // Function to get the users feed
    // Take argument through URL
//    public List<User> getFeed(final Request req, final Response res) {
//        String userID = req.params(":userId");
//        if(this.matchService.getUserStore().isUser(userID)
//                && this.matchService.getUserStore().getUserFromId(userID).hasProfile()) {
//            res.status(200);
//            return this.matchService.getUserFeed(userID, 25);
//        }
//        res.status(400);
//        return null;
//    }
    public List<Profile> getFeed(final Request req, final Response res) {
        String email = req.params(":email");
        String cookie = req.headers("auth_token");
        if (cookie == null) {
            // no cookie provided
            res.status(401);
            return null;
        }
        if (!this.matchService.getUserStore().checkEmail(email)) {
            // no account associated with email
            res.status(404);
            return null;
        }
        String userID = this.matchService.getUserStore().getIdFromEmail(email);
        if (!this.cookies.verifyCookie(cookie, userID)) {
            // malicious access, login timeout, or random user/cookie
            res.status(403);
            return null;
        }
        if(this.matchService.getUserStore().getUserFromId(userID).hasProfile()) {
            res.header("auth_token", cookie);
            res.status(200);
            return this.matchService.getUserFeed(userID, 25);
        }
        // should only get here if doesnt have profile (dont log them out)
        res.header("auth_token", cookie);
        res.status(400);
        return null;
    }

    // Function to get the users conversations/matches
    // Take argument through URL
//    public List<Conversation> getConvos(final Request req, final Response res) {
//        String userID = req.params(":userId");
//        if(this.matchService.getUserStore().isUser(userID)
//                && this.matchService.getUserStore().getUserFromId(userID).hasProfile()) {
//            res.status(200);
//            return this.conversationStore.getUserConversations(userID);
//        }
//        res.status(400);
//        return null;
//    }
    public List<ProfileResponse> getConvos(final Request req, final Response res) {
        String email = req.params(":email");
        String cookie = req.headers("auth_token");
        if (cookie == null) {
            // no cookie provided
            res.status(401);
            return null;
        }
        if (!this.matchService.getUserStore().checkEmail(email)) {
            // no account associated with email
            res.status(404);
            return null;
        }
        String userID = this.matchService.getUserStore().getIdFromEmail(email);
        if (!this.cookies.verifyCookie(cookie, userID)) {
            // malicious access, login timeout, or random user/cookie
            res.status(403);
            return null;
        }
        if(this.matchService.getUserStore().getUserFromId(userID).hasProfile()) {
            List<String> convoIds = this.conversationStore.getUserConversations(userID);
            List<ProfileResponse> convoProfs = new ArrayList<>();
            for (String id : convoIds) {
                convoProfs.add(new ProfileResponse(this.matchService.getUserStore().getProfileFromId(id)));
            }
            res.header("auth_token", cookie);
            res.status(200);
            return convoProfs;
        }
        // should only get here if doesnt have profile (dont log them out)
        res.header("auth_token", cookie);
        res.status(400);
        return null;
    }

    // Function to get a specific conversation
    // Take arguments through URL
//    public Conversation getConvo(final Request req, final Response res) {
//        String userID = req.params(":userId");
//        String convoUserId = req.params(":matchId");
//        if(userID.equals(convoUserId)) {
//            res.status(401);
//            return null;
//        }
//        if(this.matchService.getUserStore().isUser(userID)
//                && this.matchService.getUserStore().getUserFromId(userID).hasProfile()) {
//            Conversation convo = this.conversationStore.getUserConversation(userID, convoUserId);
//            if (convo != null) {
//                res.status(200);
//                return convo;
//            }
//        }
//        res.status(400);
//        return null;
//    }
    public List<Message> getConvo(final Request req, final Response res) {
        String email = req.params(":email");
        String convoUserId = req.params(":matchId");
        String cookie = req.headers("auth_token");
        if (cookie == null) {
            // no cookie provided
            res.status(401);
            return null;
        }
        if (!this.matchService.getUserStore().checkEmail(email)) {
            // no account associated with email
            res.status(404);
            return null;
        }
        String userID = this.matchService.getUserStore().getIdFromEmail(email);
        if (!this.cookies.verifyCookie(cookie, userID)) {
            // malicious access, login timeout, or random user/cookie
            res.status(403);
            return null;
        }
        if (userID.equals(convoUserId)) {
            // person wants to get conversation with themselves (bad request, dont log out)
            res.header("auth_token", cookie);
            res.status(400);
            return null;
        }
        // if got here and if in the message table, user should exist and have profile
        if(this.matchService.getMatchStore().isMatch(userID, convoUserId)) {
            res.header("auth_token", cookie);
            res.status(200);
            return this.conversationStore.getUserConversation(userID, convoUserId);
        }
        // should only get here if doesnt have profile or didnt match (dont log them out)
        res.header("auth_token", cookie);
        res.status(403);
        return null;
    }

    // Function to send a message
    // Take arguments through URL and POST body
//    public Object sendMessage(final Request req, final Response res) {
//        String userID = req.params(":userId");
//        String convoUserId = req.params(":matchId");
//        String message = req.body();
//        if (this.matchService.getUserStore().isUser(userID) && this.matchService.getUserStore().isUser(convoUserId)
//            && this.matchService.getMatchStore().isMatch(userID, convoUserId)) {
//            this.conversationStore.getUserConversation(userID, convoUserId).sendMessage(userID, Message.Message_Type.TEXT, message);
//            return null;
//        }
//        res.status(400);
//        return null;
//    }
    public Object sendMessage(final Request req, final Response res) {
        String email = req.params(":email");
        String convoUserId = req.params(":matchId");
        String cookie = req.headers("auth_token");
        if (cookie == null) {
            // no cookie provided
            res.status(401);
            return null;
        }
        if (!this.matchService.getUserStore().checkEmail(email)) {
            // no account associated with email
            res.status(404);
            return null;
        }
        String userID = this.matchService.getUserStore().getIdFromEmail(email);
        if (!this.cookies.verifyCookie(cookie, userID)) {
            // malicious access, login timeout, or random user/cookie
            res.status(403);
            return null;
        }
        if (userID.equals(convoUserId)) {
            // person wants to unmatch themselves (bad request, dont log out)
            res.header("auth_token", cookie);
            res.status(400);
            return null;
        }
        Hashtable<String, String> info = this.gson.fromJson(req.body(), new TypeToken<Hashtable<String, String>>(){}.getType());
        // if got here and if in the match table, user should exist and have profile
        if(this.matchService.getMatchStore().isMatch(userID, convoUserId)) {
            // TODO
            // in the future add different message types
            this.conversationStore.sendMessage(new Message(userID,
                                                            convoUserId,
                                                            Message.Message_Type.TEXT,
                                                            info.get("message"),
                                                            new Timestamp(System.currentTimeMillis())));
            res.header("auth_token", cookie);
            res.status(200);
            return null;
        }
        // should only get here if doesnt have profile or didnt match (dont log them out)
        res.header("auth_token", cookie);
        res.status(403);
        return null;
    }

    // Function to allow users to like others
    // Take arguments through URL and POST body
//    public Object like(final Request req, final Response res) {
//        String userID = req.params(":userId");
//        String likedUserID = req.body();
//        if(this.matchService.getUserStore().isUser(userID)
//                && this.matchService.getUserStore().getUserFromId(userID).hasProfile()
//                && this.matchService.getUserStore().isUser(likedUserID)
//                && this.matchService.getUserStore().getUserFromId(likedUserID).hasProfile()) {
//            boolean match = this.matchService.getMatchStore().addLike(userID, likedUserID);
//            if (match) {
//                this.conversationStore.addConversation(new Conversation(userID, likedUserID));
//            }
//            res.status(200);
//            return null;
//        }
//        res.status(400);
//        return null;
//    }
    public Object like(final Request req, final Response res) {
        String email = req.params(":email");
        String cookie = req.headers("auth_token");
        if (cookie == null) {
            // no cookie provided
            res.status(401);
            return null;
        }
        if (!this.matchService.getUserStore().checkEmail(email)) {
            // no account associated with email
            res.status(404);
            return null;
        }
        String userID = this.matchService.getUserStore().getIdFromEmail(email);
        if (!this.cookies.verifyCookie(cookie, userID)) {
            // malicious access, login timeout, or random user/cookie
            res.status(403);
            return null;
        }
        Hashtable<String, String> info = this.gson.fromJson(req.body(), new TypeToken<Hashtable<String, String>>(){}.getType());
        String likeUserId = info.get("liked_userID");
        if (userID.equals(likeUserId)) {
            // person wants to like themselves (bad request, dont log out)
            res.header("auth_token", cookie);
            res.status(400);
            return null;
        }
        if(this.matchService.getUserStore().getUserFromId(userID).hasProfile()
                && this.matchService.getUserStore().isUser(likeUserId)
                && this.matchService.getUserStore().getUserFromId(likeUserId).hasProfile()) {
            if (this.matchService.getMatchStore().addLike(userID, likeUserId)) {
                // returns true if there is match, in which case add empty message to messages table
                // so that matched user will come up in getConversations call
                this.conversationStore.sendMessage(new Message(userID,
                                                                likeUserId,
                                                                Message.Message_Type.MATCH,
                                                                "",
                                                                new Timestamp(System.currentTimeMillis())));
            }
            res.header("auth_token", cookie);
            res.status(200);
            return null;
        }
        // should only get here if doesnt have profile (dont log them out)
        res.header("auth_token", cookie);
        res.status(403);
        return null;
    }

    // Function to allow users to dislike others
    // Take arguments through URL and POST body
//    public Object dislike(final Request req, final Response res) {
//        String userID = req.params(":userId");
//        String dislikedUserID = req.body();
//        if(this.matchService.getUserStore().isUser(userID)
//                && this.matchService.getUserStore().getUserFromId(userID).hasProfile()
//                && this.matchService.getUserStore().isUser(dislikedUserID)
//                && this.matchService.getUserStore().getUserFromId(dislikedUserID).hasProfile()) {
//            this.matchService.getMatchStore().addDislike(userID, dislikedUserID);
//            res.status(200);
//            return null;
//        }
//        res.status(400);
//        return null;
//    }
    public Object dislike(final Request req, final Response res) {
        String email = req.params(":email");
        String cookie = req.headers("auth_token");
        if (cookie == null) {
            // no cookie provided
            res.status(401);
            return null;
        }
        if (!this.matchService.getUserStore().checkEmail(email)) {
            // no account associated with email
            res.status(404);
            return null;
        }
        String userID = this.matchService.getUserStore().getIdFromEmail(email);
        if (!this.cookies.verifyCookie(cookie, userID)) {
            // malicious access, login timeout, or random user/cookie
            res.status(403);
            return null;
        }
        Hashtable<String, String> info = this.gson.fromJson(req.body(), new TypeToken<Hashtable<String, String>>(){}.getType());
        String dislikeUserId = info.get("disliked_userID");
        if (userID.equals(dislikeUserId)) {
            // person wants to dislike themselves (bad request, dont log out)
            res.header("auth_token", cookie);
            res.status(400);
            return null;
        }
        if(this.matchService.getUserStore().getUserFromId(userID).hasProfile()
                && this.matchService.getUserStore().isUser(dislikeUserId)
                && this.matchService.getUserStore().getUserFromId(dislikeUserId).hasProfile()) {
            this.matchService.getMatchStore().addDislike(userID, dislikeUserId);
            res.header("auth_token", cookie);
            res.status(200);
            return null;
        }
        // should only get here if doesnt have profile (dont log them out)
        res.header("auth_token", cookie);
        res.status(403);
        return null;
    }

    // Function to allow users to unmatch with other users
    // Take arguments through URL
//    public Object unmatch(final Request req, final Response res) {
//        String userID = req.params(":userId");
//        String unmatchedUserID = req.params(":matchId");
//        if(this.matchService.getUserStore().isUser(userID) && this.matchService.getUserStore().isUser(unmatchedUserID)
//                && this.matchService.getMatchStore().isMatch(userID, unmatchedUserID)) {
//            this.matchService.getMatchStore().unmatch(userID, unmatchedUserID);
//            this.conversationStore.deleteConversation(userID, unmatchedUserID);
//            res.status(200);
//            return null;
//        }
//        res.status(400);
//        return null;
//    }
    public Object unmatch(final Request req, final Response res) {
        String email = req.params(":email");
        String unmatchUserId = req.params(":matchId");
        String cookie = req.headers("auth_token");
        if (cookie == null) {
            // no cookie provided
            res.status(401);
            return null;
        }
        if (!this.matchService.getUserStore().checkEmail(email)) {
            // no account associated with email
            res.status(404);
            return null;
        }
        String userID = this.matchService.getUserStore().getIdFromEmail(email);
        if (!this.cookies.verifyCookie(cookie, userID)) {
            // malicious access, login timeout, or random user/cookie
            res.status(403);
            return null;
        }
        if (userID.equals(unmatchUserId)) {
            // person wants to unmatch themselves (bad request, dont log out)
            res.header("auth_token", cookie);
            res.status(400);
            return null;
        }
        // if got here and if in the match table, user should exist and have profile
        if(this.matchService.getMatchStore().isMatch(userID, unmatchUserId)) {
            this.matchService.getMatchStore().unmatch(userID, unmatchUserId);
            res.header("auth_token", cookie);
            res.status(200);
            return null;
        }
        // should only get here if doesnt have profile or didnt match (dont log them out)
        res.header("auth_token", cookie);
        res.status(403);
        return null;
    }
}