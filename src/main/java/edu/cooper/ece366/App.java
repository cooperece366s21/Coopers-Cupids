package edu.cooper.ece366;

import static spark.Spark.before;
import static spark.Spark.get;
import static spark.Spark.initExceptionHandler;
import static spark.Spark.options;
import static spark.Spark.post;

import edu.cooper.ece366.handler.Handler;
import edu.cooper.ece366.store.UserStoreImpl;
import edu.cooper.ece366.store.MatchStoreImpl;
import edu.cooper.ece366.store.ConversationStoreImpl;
import edu.cooper.ece366.service.MatchFeedServiceImpl;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import spark.ResponseTransformer;

/**
 * Hello world!
 *
 */
public class App 
{
    public static void main( String[] args )
    {
        Gson gson = new GsonBuilder().create();

        ResponseTransformer responseTransformer = model -> {
                                                            if (model == null) {
                                                            return "";
                                                        }
                                                        return gson.toJson(model);
                                                   };

        initExceptionHandler(Throwable::printStackTrace);

        Handler handler = new Handler(
                            new MatchFeedServiceImpl(new MatchStoreImpl(), new UserStoreImpl()),
                            new ConversationStoreImpl(),
                            gson);

        options(
                "/*",
                (request, response) -> {
                    String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
                    if (accessControlRequestHeaders != null) {
                        //            response.header("Access-Control-Allow-Headers",
                        // accessControlRequestHeaders);
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
        post("/signup", (req, res) -> handler.signup(req, res), responseTransformer);
        post("/login", (req, res) -> handler.login(req, res), responseTransformer);
        post("/logout", (req, res) -> handler.logout(req, res), responseTransformer);
        get("/me", (req, res) -> handler.me(req, res), responseTransformer);
        get("/user/:userId", (req, res) -> handler.getUser(req), responseTransformer);
        post("/user/:userId/create", (req, res) -> handler.create(req, res), responseTransformer);
        get("/user/:userId/profile", (req, res) -> handler.getProfile(req, res), responseTransformer);
        get("/user/:userId/feed", (req, res) -> handler.getFeed(req), responseTransformer);
        post("/user/:userId/feed/like", (req, res) -> handler.like(req, res), responseTransformer);
        post("/user/:userId/feed/dislike", (req, res) -> handler.dislike(req, res), responseTransformer);
        get("/user/:userId/convos", (req, res) -> handler.getConvos(req), responseTransformer);
        post("/user/:userId/convos/:matchId", (req, res) -> handler.getConvo(req, res), responseTransformer);
        post("/user/:userId/convos/:matchId/send", (req, res) -> handler.sendMessage(req, res), responseTransformer);
        post("/user/:userId/convos/:matchId/unmatch", (req, res) -> handler.unmatch(req, res), responseTransformer);
    }
}
