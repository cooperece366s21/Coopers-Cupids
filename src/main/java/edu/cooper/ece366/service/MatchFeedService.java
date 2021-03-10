package edu.cooper.ece366.service;

import edu.cooper.ece366.model.User;
import edu.cooper.ece366.store.MatchStore;
import edu.cooper.ece366.store.UserStore;

import java.util.List;

public interface MatchFeedService {
    // Returns feed for current user
    List<User> getUserFeed(String userID, int numUsers);

    MatchStore getMatchStore();

    UserStore getUserStore();
}
