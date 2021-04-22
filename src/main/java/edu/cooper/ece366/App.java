package edu.cooper.ece366;

import static spark.Spark.before;
import static spark.Spark.get;
import static spark.Spark.initExceptionHandler;
import static spark.Spark.options;
import static spark.Spark.post;

import edu.cooper.ece366.auth.Cookies;
import spark.ResponseTransformer;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.jdbi.v3.core.Jdbi;

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
        // TODO
        // may add post method for changing userID/password in the future
        get("/user/:userId", handler::getUser, responseTransformer);
        // doesnt need a get method (can be done in frontend)
        post("/user/:userId/create", handler::create, responseTransformer);
        // TODO
        // may add post method for changing userID/password in the future
        get("/user/:userId/profile", handler::getProfile, responseTransformer);
        // no post method needed (use like/dislike as necessary)
        get("/user/:userId/feed", handler::getFeed, responseTransformer);
        post("/user/:userId/feed/like", handler::like, responseTransformer);
        post("/user/:userId/feed/dislike", handler::dislike, responseTransformer);
        // doesnt need post method (cant create new conversation without match)
        get("/user/:userId/convos", handler::getConvos, responseTransformer);
        // doesnt need post method (use send to post/send message)
        get("/user/:userId/convos/:matchId", handler::getConvo, responseTransformer);
        post("/user/:userId/convos/:matchId/send", handler::sendMessage, responseTransformer);
        // doesnt need get method needed
        post("/user/:userId/convos/:matchId/unmatch", handler::unmatch, responseTransformer);
    }
}