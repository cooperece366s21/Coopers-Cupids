package edu.cooper.ece366;

import static spark.Spark.before;
import static spark.Spark.get;
import static spark.Spark.initExceptionHandler;
import static spark.Spark.options;
import static spark.Spark.post;

import edu.cooper.ece366.service.EmailService;
import spark.ResponseTransformer;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.jdbi.v3.core.Jdbi;

import edu.cooper.ece366.auth.Cookies;
import edu.cooper.ece366.service.MatchFeedServiceSQL;
import edu.cooper.ece366.handler.Handler;
import edu.cooper.ece366.store.*;

public class App 
{
    public static void main( String[] args ) {
        // when installing MySQL, making sure to make password 123456
        // changing the password in MySQL after installation is a PIA
        //
        // must run:
        //
        //      CREATE SCHEMA `coopids` ;
        //
        // in MySQL before connecting
        String jdbcUrl = "jdbc:mysql://127.0.0.1:3306/coopids";
        String schemaPath = "src/main/resources/sql/schema.sql";

        Jdbi jdbi = CoopidsJdbi.create(jdbcUrl, "root", "123456");
        CoopidsJdbi.setupSchema(jdbi, schemaPath);

        Gson gson = new GsonBuilder().setLenient().create();

        ResponseTransformer responseTransformer = model -> {
                                                            if (model == null) {
                                                            return "";
                                                        }
                                                        return gson.toJson(model);
                                                   };

        initExceptionHandler(Throwable::printStackTrace);

        Handler handler = new Handler(
                            new MatchFeedServiceSQL(new MatchStoreMySQL(jdbi), new UserStoreMySQL(jdbi)),
                            new ConversationStoreMySQL(jdbi),
                            new Cookies(jdbi),
                            gson,
                            new EmailService("markkoszykowski@gmail.com", "")
        );

        options(
                "/*",
                (request, response) -> {
                    String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
                    if (accessControlRequestHeaders != null) {
                        response.header("Access-Control-Allow-Headers", "*");
                    }

                    String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
                    if (accessControlRequestMethod != null) {
                        response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
                        response.header("Access-Control-Allow-Methods", "*");
                    }

                    return "OK";
                });

        before(
                (req, res) -> {
                    res.header("Access-Control-Allow-Origin", "*");
                    res.header("Access-Control-Allow-Headers", "*");
                    res.header("Access-Control-Expose-Headers", "*");
                    res.type("application/json");
                });

        // method to test server connection
        get("/ping", (req, res) -> "OK");
        // method to signup
        // doesnt need a get method (can be done in frontend)
        post("/signup", handler::signup, responseTransformer);
        // method to login with create account
        // doesnt need a get method (can be done in frontend)
        post("/login", handler::login, responseTransformer);
        // method to logout if logged in
        // doesnt need a get method (can be done in frontend)
        post("/logout", handler::logout, responseTransformer);
        // method to retrieve persons account
        get("/user/:email", handler::getUser, responseTransformer);
        // method to delete account (and all associated data on server)
        post("/user/:email/delete", handler::deleteAccount, responseTransformer);
        // method to update a users email associated with account (requires password check)
        post("/user/:email/editEmail", handler::changeEmail, responseTransformer);
        // method to update a users password (requires password check)
        post("/user/:email/editPassword", handler::changePassword, responseTransformer);
        // method to create a profile for an account
        post("/user/:email/create", handler::create, responseTransformer);
        // method to retrieve profile associated with account
        get("/user/:email/profile", handler::getProfile, responseTransformer);
        // method to update a users profile
        post("/user/:email/profile/edit", handler::editProfile, responseTransformer);
        // method to get a feed for a person
        // no post method needed (use like/dislike as necessary)
        get("/user/:email/feed", handler::getFeed, responseTransformer);
        // method to send a like to another profile
        post("/user/:email/feed/like", handler::like, responseTransformer);
        // method to send a dislike to another profile
        post("/user/:email/feed/dislike", handler::dislike, responseTransformer);
        // method to retrieve conversations with matched users
        // doesnt need post method (cant create new conversation without match)
        get("/user/:email/convos", handler::getConvos, responseTransformer);
        // method to get a specific conversation with a matched user
        // doesnt need post method (use send to post/send message)
        get("/user/:email/convos/:matchId", handler::getConvo, responseTransformer);
        // method to send a message in a conversation
        post("/user/:email/convos/:matchId/send", handler::sendMessage, responseTransformer);
        // method to unmatch with a specific user
        // doesnt need get method needed
        post("/user/:email/convos/:matchId/unmatch", handler::unmatch, responseTransformer);
        // method to get a persons profile if they matched
        // shouldnt have post method because cant change others profiles
        get("/user/:email/profile/:matchId", handler::getMatchProfile, responseTransformer);
    }
}