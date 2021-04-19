package edu.cooper.ece366;

import static spark.Spark.before;
import static spark.Spark.get;
import static spark.Spark.initExceptionHandler;
import static spark.Spark.options;
import static spark.Spark.post;

import java.util.List;
import spark.ResponseTransformer;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.jdbi.v3.core.Jdbi;

import edu.cooper.ece366.model.Profile;
import edu.cooper.ece366.model.User;
import edu.cooper.ece366.service.MatchFeedService;
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

        UserStore store = new UserStoreMySQL(jdbi);
        store.addUser(new User("test1", "test1", false));
        store.addProfile(new Profile("test1", "mark", 21, "google.com", "im interesting", "NY", "making apps"));
        store.addUser(new User("test2", "test2", false));
        store.addProfile(new Profile("test2", "andrew", 21, "google.com", "im interesting", "NY", "making apps"));
        store.addUser(new User("test3", "test3", false));
        store.addProfile(new Profile("test3", "shine", 21, "google.com", "im interesting", "NY", "making apps"));

        MatchStore store1 = new MatchStoreMySQL(jdbi);
        store1.addLike("test1", "test2");
        store1.addDislike("test1", "test3");
        store1.addLike("test3", "test1");
        store1.addLike("test3", "test2");
        MatchFeedService service = new MatchFeedServiceSQL(store1, store);

        List<Profile> feed = service.getUserFeed("test2", 15);
        for (Profile f : feed) {
            System.out.println(f.getName());
        }
        store1.addLike("test2", "test1");
        System.out.println(store1.isMatch("test1", "test2"));
        System.out.println(store1.isMatch("test1", "test3"));

        feed = service.getUserFeed("test2", 15);
        for (Profile f : feed) {
            System.out.println(f.getName());
        }

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
                    res.type("application/json");
                });

        get("/ping", (req, res) -> "OK");
        post("/signup", handler::signup, responseTransformer);
        post("/login", handler::login, responseTransformer);
        post("/logout", handler::logout, responseTransformer);
        get("/me", handler::me, responseTransformer);
        get("/user/:userId", handler::getUser, responseTransformer);
        post("/user/:userId/create", handler::create, responseTransformer);
        get("/user/:userId/profile", handler::getProfile, responseTransformer);
        get("/user/:userId/feed", handler::getFeed, responseTransformer);
        post("/user/:userId/feed/like", handler::like, responseTransformer);
        post("/user/:userId/feed/dislike", handler::dislike, responseTransformer);
        get("/user/:userId/convos", handler::getConvos, responseTransformer);
        get("/user/:userId/convos/:matchId", handler::getConvo, responseTransformer);
        post("/user/:userId/convos/:matchId/send", handler::sendMessage, responseTransformer);
        post("/user/:userId/convos/:matchId/unmatch", handler::unmatch, responseTransformer);
    }
}