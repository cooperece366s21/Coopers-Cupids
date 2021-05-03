package edu.cooper.ece366;

import static spark.Spark.before;
import static spark.Spark.get;
import static spark.Spark.initExceptionHandler;
import static spark.Spark.options;
import static spark.Spark.post;

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
                            gson);

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

        get("/ping", (req, res) -> "OK");
        // doesnt need a get method (can be done in frontend)
        post("/signup", handler::signup, responseTransformer);
        // doesnt need a get method (can be done in frontend)
        post("/login", handler::login, responseTransformer);
        // doesnt need a get method (can be done in frontend)
        post("/logout", handler::logout, responseTransformer);
        // may delete since same as below
        // get("/me", handler::me, responseTransformer);
        get("/user/:email", handler::getUser, responseTransformer);
        // requests password ("password")
        post("/user/:email/delete", handler::deleteAccount, responseTransformer);
        // requests password (for verification) ("password") and new email ("email") in body
        post("/user/:email/editEmail", handler::changeEmail, responseTransformer);
        // requests old password (for verification) ("old_password") and new password ("new_password") in body
        post("/user/:email/editPassword", handler::changePassword, responseTransformer);
        // doesnt need a get method (can be done in frontend)
        post("/user/:email/create", handler::create, responseTransformer);
        get("/user/:email/profile", handler::getProfile, responseTransformer);
        post("/user/:email/profile/edit", handler::editProfile, responseTransformer);
        // no post method needed (use like/dislike as necessary)
        get("/user/:email/feed", handler::getFeed, responseTransformer);
        post("/user/:email/feed/like", handler::like, responseTransformer);
        post("/user/:email/feed/dislike", handler::dislike, responseTransformer);
        // doesnt need post method (cant create new conversation without match)
        get("/user/:email/convos", handler::getConvos, responseTransformer);
        // doesnt need post method (use send to post/send message)
        get("/user/:email/convos/:matchId", handler::getConvo, responseTransformer);
        post("/user/:email/convos/:matchId/send", handler::sendMessage, responseTransformer);
        // doesnt need get method needed
        post("/user/:email/convos/:matchId/unmatch", handler::unmatch, responseTransformer);
    }
}